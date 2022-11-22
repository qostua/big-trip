import TripSortView from '../view/trip-sort.js';
import PointsListView from '../view/points-list.js';
import EmptyListPlugView from '../view/empty-list-plug.js';
import PointPresenter from './point.js';

import {render, RenderPosition} from '../utils/render.js';

export default class Trip {
  constructor(pointsContainer, destinations, offersData) {
    this._pointsContainer = pointsContainer;

    this._destinations = destinations;
    this._offersData = offersData;

    this._tripSortComponent = new TripSortView();
    this._pointsListComponent = new PointsListView();
    this._emptyListPlugComponent = new EmptyListPlugView();
  }

  init(points) {
    this._points = points;
    render(this._pointsContainer, this._pointsListComponent, RenderPosition.AFTERBEGIN);

    this._renderTripPoints();
  }

  _renderTripSort() {
    render(this._pointsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._destinations, this._offersData);

    pointPresenter.init(point);
  }

  _renderPoints() {
    this._points.forEach((point) => this._renderPoint(point));
  }

  _renderEmptyListPlug() {
    render(this._pointsContainer, this._emptyListPlugComponent, RenderPosition.BEFOREEND);
  }

  _renderTripPoints() {
    if (this._points.length === 0) {
      this._renderEmptyListPlug();
      return;
    }

    this._renderTripSort();
    this._renderPoints();
  }
}
