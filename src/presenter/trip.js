import TripSortView from '../view/trip-sort.js';
import PointsListView from '../view/points-list.js';
import EmptyListPlugView from '../view/empty-list-plug.js';
import PointPresenter from './point.js';

import {render, remove, RenderPosition} from '../utils/render.js';
import {compareDatePoints, compareTimePoints, comparePricePoints} from '../utils/point.js';

import {FilterTypes, UpdateType, UserAction} from '../const.js';

export default class Trip {
  constructor(pointsContainer, pointsModel, offersModel, descriptionsModel) {
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._descriptionsModel = descriptionsModel;

    this._pointsContainer = pointsContainer;
    this._currentSortType = FilterTypes.DAY.name;

    this._pointPresenters = new Map();

    this._tripSortComponent = new TripSortView();
    this._pointsListComponent = new PointsListView();
    this._emptyListPlugComponent = new EmptyListPlugView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._pointsContainer, this._pointsListComponent, RenderPosition.AFTERBEGIN);

    this._renderTrip();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case FilterTypes.DAY.name:
        return this._pointsModel.points.slice().sort(compareDatePoints);
      case FilterTypes.TIME.name:
        return this._pointsModel.points.slice().sort(compareTimePoints);
      case FilterTypes.PRICE.name:
        return this._pointsModel.points.slice().sort(comparePricePoints);
    }

    return this._pointsModel.points;
  }

  _getOffers() {
    return this._offersModel.offers;
  }

  _getDescriptions() {
    return this._descriptionsModel.descriptions;
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
  }

  _renderTripSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._pointsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._getOffers(), this._getDescriptions(), this._handleViewAction, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenters.set(point.id, pointPresenter);
  }

  _renderEmptyListPlug() {
    render(this._pointsContainer, this._emptyListPlugComponent, RenderPosition.BEFOREEND);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();

    remove(this._emptyListPlugComponent);
    remove(this._tripSortComponent);

    if (resetSortType) {
      this._currentSortType = FilterTypes.DAY.name;
    }
  }

  _renderTrip() {
    const points = this._getPoints();

    if (points.length === 0) {
      this._renderEmptyListPlug();
      return;
    }

    this._renderTripSort();

    points.forEach((point) => this._renderPoint(point));
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
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
