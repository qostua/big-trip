import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';

import {render, remove, RenderPosition} from '../utils/render.js';

export default class Summary {
  constructor(summaryContainer, pointsModel) {
    this._summaryContainer = summaryContainer;
    this._pointsModel = pointsModel;

    this._tripInfoComponent = null;
    this._tripCostComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._clearSummary();
    this._renderSummary();
  }

  _renderSummary() {
    const points = this._pointsModel.getPoints();
    const pointCount = points.length;

    if (pointCount === 0) {
      return;
    }

    this._tripInfoComponent = new TripInfoView(this._getCities(), this._getDates());
    this._tripCostComponent = new TripCostView(this._getCost());

    render(this._summaryContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._tripInfoComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
  }

  _clearSummary() {
    if (this._tripInfoComponent === null && this._tripCostComponent === null) {
      return;
    }

    remove(this._tripInfoComponent);
    remove(this._tripCostComponent);
  }

  _getCities() {
    const points = this._pointsModel.getPoints();

    const cities = new Set();

    points.forEach((point) => cities.add(point.destination.name));

    return Array.from(cities);
  }

  _getDates() {
    const points = this._pointsModel.getPoints();

    return points.map((point) => point.dateFrom);
  }

  _getCost() {
    const points = this._pointsModel.getPoints();

    return points.reduce((prevPointsPrice, point) => {
      const offersPrice = point.offers.reduce((prevOffersPrice, offer) => prevOffersPrice + offer.price, 0);
      return prevPointsPrice + point.price + offersPrice;
    }, 0);
  }

  _handleModelEvent() {
    this.init();
  }
}
