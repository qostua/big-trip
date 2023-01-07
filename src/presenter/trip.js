import TripView from '../view/trip.js';
import SortingView from '../view/sorting.js';
import EmptyListPlugView from '../view/empty-list-plug.js';
import LoadingView from '../view/loading.js';

import PointPresenter, {State as PointPresenterViewState} from './point.js';
import NewPointEditingPresenter from './new-point-editing.js';

import {render, remove, RenderPosition} from '../utils/render.js';
import {compareDatePoints, compareTimePoints, comparePricePoints} from '../utils/point.js';
import {filter} from '../utils/filter.js';
import {SortType, FilterType, UpdateType, UserAction} from '../const.js';

export default class Trip {
  constructor(tripContainer, pointsModel, offersModel, descriptionsModel, filtersModel, api) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._descriptionsModel = descriptionsModel;
    this._filtersModel = filtersModel;
    this._api = api;

    this._currentSortType = SortType.DAY.name;
    this._currentFilterType = FilterType.EVERYTHING;

    this._pointPresenters = new Map();
    this._newPointEditingPresenter = null;

    this._sortingComponent = null;
    this._emptyListPlugComponent = null;
    this._tripComponent = new TripView();
    this._loadingComponent = new LoadingView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
    this._descriptionsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);

    const pointsList = this._tripComponent.getElement().querySelector('.trip-events__list');
    this._newPointEditingPresenter = new NewPointEditingPresenter(pointsList, this._getOffers(), this._getDescriptions(), this._handleViewAction);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetSortType: true});
    remove(this._tripComponent);
    remove(this._sortingComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filtersModel.removeObserver(this._handleModelEvent);
    this._descriptionsModel.removeObserver(this._descriptionsModel);
    this._offersModel.removeObserver(this._offersModel);
  }

  createPoint(callback) {
    this._currentSortType = SortType.DAY.name;
    this._filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointEditingPresenter.init(callback);
  }

  _getPoints() {
    this._currentFilterType = this._filtersModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[this._currentFilterType](points);

    switch (this._currentSortType) {
      case SortType.DAY.name:
        return filtredPoints.sort(compareDatePoints);
      case SortType.TIME.name:
        return filtredPoints.sort(compareTimePoints);
      case SortType.PRICE.name:
        return filtredPoints.sort(comparePricePoints);
    }

    return filtredPoints;
  }

  _getOffers() {
    return this._offersModel.getOffers();
  }

  _getDescriptions() {
    return this._descriptionsModel.getDestinations();
  }

  _renderTripSort() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripComponent, this._sortingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointsList = this._tripComponent.getElement().querySelector('.trip-events__list');

    const pointPresenter = new PointPresenter(pointsList, this._getOffers(), this._getDescriptions(), this._handleViewAction, this._handleModeChange, this._getPointDataLoadingStatus());

    pointPresenter.init(point);
    this._pointPresenters.set(point.id, pointPresenter);
  }

  _getPointDataLoadingStatus() {
    return this._offersModel.loadingStatus || this._descriptionsModel.loadingStatus;
  }

  _renderTrip() {
    if (this._pointsModel.loadingStatus) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();

    if (points.length === 0) {
      this._renderEmptyListPlug();
      return;
    }

    this._renderTripSort();
    points.forEach((point) => this._renderPoint(point));
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();
    this._newPointEditingPresenter.destroy();

    if (this._emptyListPlugComponent) {
      remove(this._emptyListPlugComponent);
    }
    if (this._loadingComponent) {
      remove(this._loadingComponent);
    }

    remove(this._sortingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY.name;
    }
  }

  _renderEmptyListPlug() {
    this._emptyListPlugComponent = new EmptyListPlugView(this._currentFilterType);
    render(this._tripComponent, this._emptyListPlugComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._tripComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _handleModeChange() {
    this._pointPresenters.forEach((presenter) => presenter.resetView());
    this._newPointEditingPresenter.destroy();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenters.get(update.id).setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenters.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._newPointEditingPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._newPointEditingPresenter.setAborting();
            this._newPointEditingPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenters.get(update.id).setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenters.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }
}
