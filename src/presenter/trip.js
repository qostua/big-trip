import TripSortView from '../view/trip-sort.js';
import PointsListView from '../view/points-list.js';
import EmptyListPlugView from '../view/empty-list-plug.js';
import PointPresenter from './point.js';

import {render, RenderPosition} from '../utils/render.js';
import {comparePricePoints, compareTimePoints, updatePoint} from '../utils/point.js';
import {compareDatePoints} from '../utils/point.js';

import {FilterTypes} from '../const.js';

export default class Trip {
  constructor(pointsContainer, destinations, offersData) {
    this._pointsContainer = pointsContainer;
    this._currentSortType = FilterTypes.DAY;

    this._points = [];
    this._pointPresenters = new Map();

    this._destinations = destinations;
    this._offersData = offersData;

    this._tripSortComponent = new TripSortView();
    this._pointsListComponent = new PointsListView();
    this._emptyListPlugComponent = new EmptyListPlugView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.sort(compareDatePoints);
    render(this._pointsContainer, this._pointsListComponent, RenderPosition.AFTERBEGIN);

    this._renderTrip();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPoints();
    this._renderPoints();
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case FilterTypes.DAY.name:
        this._points.sort(compareDatePoints);
        break;
      case FilterTypes.TIME.name:
        this._points.sort(compareTimePoints);
        break;
      case FilterTypes.PRICE.name:
        this._points.sort(comparePricePoints);
        break;
    }

    this._currentSortType = sortType;
  }

  _handleModeChange() {
    this._pointPresenters.forEach((presenter) => presenter.resetView());
  }

  _renderTripSort() {
    render(this._pointsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._destinations, this._offersData, this._handlePointChange, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenters.set(point.id, pointPresenter);
  }

  _renderPoints() {
    this._points.forEach((point) => this._renderPoint(point));
  }

  _clearPoints() {
    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();
  }

  _renderEmptyListPlug() {
    render(this._pointsContainer, this._emptyListPlugComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._points.length === 0) {
      this._renderEmptyListPlug();
      return;
    }

    this._renderTripSort();
    this._renderPoints();
  }

  _handlePointChange(updatedPoint) {
    this._points = updatePoint(this._points, updatedPoint);
    this._pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }
}
