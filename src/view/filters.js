import {createElement} from '../utils.js';
import {FILTERS} from '../const.js';

const createFiltersList = () => FILTERS.map((filter, index) => (
  `<div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${index === 0 ? 'checked' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
  </div>`
)).join('');

const createTripFiltersTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
    ${createFiltersList()}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class TripFilters {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripFiltersTemplate();
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
