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
    const prevTripInfoComponent = this._tripInfoComponent;
    const prevTripCostComponent = this._tripCostComponent;

    this._tripInfoComponent = new TripInfoView(this._getCities(), this._getDates());
    this._tripCostComponent = new TripCostView(this._getCost());

    if (prevTripInfoComponent === null && prevTripCostComponent === null) {
      this._renderSummary();
      return;
    }

    remove(prevTripInfoComponent);
    remove(prevTripCostComponent);

    this._renderSummary();
  }

  _renderSummary() {
    const points = this._pointsModel.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      return;
    }

    render(this._summaryContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._tripInfoComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
  }

  _handleModelEvent() {
    this.init();
  }

  _getCost() {
    const points = this._pointsModel.points;

    return points.reduce((prevPointsPrice, point) => {
      const offersPrice = point.offers.reduce((prevOffersPrice, offer) => prevOffersPrice + offer.price, 0);
      return prevPointsPrice + point.price + offersPrice;
    }, 0);
  }

  _getCities() {
    const points = this._pointsModel.points;
    const cities = new Set();

    points.forEach((point) => cities.add(point.destination.name));

    return Array.from(cities);
  }

  _getDates() {
    const points = this._pointsModel.points;

    return points.map((point) => point.dateFrom);
  }
}
