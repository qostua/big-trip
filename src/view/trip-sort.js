import AbstractView from './abstract.js';
import {FilterTypes} from '../const.js';

const SORTING_FILTERS = ['DAY', 'EVENT', 'TIME', 'PRICE', 'OFFERS'];

const createFilterItemTemplate = (filter, isEnable, isChecked) => (
  `<div class="trip-sort__item  trip-sort__item--${filter}">
    <input
      id="sort-${filter}"
      data-sort-type="${filter}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${filter}"
      ${isChecked ? 'checked' : ''}
      ${isEnable ? '' : 'disabled'}
    >
    <label class="trip-sort__btn" for="sort-${filter}">
      ${filter}
    </label>
  </div>`
);

const createFilterListTemplate = (filters) => filters
  .map((filter, index) => createFilterItemTemplate(FilterTypes[filter].name, FilterTypes[filter].mod, index === 0))
  .join('');

const createTripSortTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createFilterListTemplate(SORTING_FILTERS)}
  </form>`
);

export default class TripSort extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripSortTemplate();
  }

  _sortTypeChangeHandler(event) {
    event.preventDefault();
    this._callback.sortTypeChange(event.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('input', this._sortTypeChangeHandler);
  }
}
