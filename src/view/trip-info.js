import {createElement} from '../utils.js';

const createTripInfoTemplate = (cities, dateRangeString) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cities.join(' &mdash; ')}</h1>

      <p class="trip-info__dates">${dateRangeString}</p>
    </div>
  </section>`
);

export default class TripInfo {
  constructor(cities, dateRangeString) {
    this._cities = cities;
    this._dateRangeString = dateRangeString;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._cities, this._dateRangeString);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
