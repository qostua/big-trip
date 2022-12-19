import TripSortView from '../view/trip-sort.js';
import PointsListView from '../view/points-list.js';
import EmptyListPlugView from '../view/empty-list-plug.js';
import PointPresenter from './point.js';

import {render, RenderPosition} from '../utils/render.js';
import {compareDatePoints, compareTimePoints, comparePricePoints} from '../utils/point.js';

import {FilterTypes} from '../const.js';

export default class Trip {
  constructor(pointsContainer, pointsModel, offersModel, descriptionsModel) {
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._descriptionsModel = descriptionsModel;

    this._pointsContainer = pointsContainer;
    this._currentSortType = FilterTypes.DAY;

    this._pointPresenters = new Map();

    this._tripSortComponent = new TripSortView();
    this._pointsListComponent = new PointsListView();
    this._emptyListPlugComponent = new EmptyListPlugView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._pointsContainer, this._pointsListComponent, RenderPosition.AFTERBEGIN);

    this._renderTrip();
  }

  _getPoint() {
    switch (this._currentSortType) {
      case FilterTypes.DAY:
        return this._pointsModel.points.slice().sort(compareDatePoints);
      case FilterTypes.PRICE:
        return this._pointsModel.points.slice().sort(compareTimePoints);
      case FilterTypes.TIME:
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
    this._clearPoints();
    this._renderPoints();
  }

  _handleModeChange() {
    this._pointPresenters.forEach((presenter) => presenter.resetView());
  }

  _renderTripSort() {
    render(this._pointsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._getOffers(), this._getDescriptions(), this._handlePointChange, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenters.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  _clearPoints() {
    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();
  }

  _renderEmptyListPlug() {
    render(this._pointsContainer, this._emptyListPlugComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    const points = this._getPoint();

    if (points.length === 0) {
      this._renderEmptyListPlug();
      return;
    }

    this._renderTripSort();
    this._renderPoints(points);
  }

  _handlePointChange(updatedPoint) {
    this._pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }
}
