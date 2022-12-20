import AbstractView from './abstract.js';
import {FilterTypes} from '../const.js';

const SORTING_FILTERS = ['DAY', 'EVENT', 'TIME', 'PRICE', 'OFFERS'];

const createFilterItem = (filter, isEnable, isChecked) => (
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

const createFilterList = (filters, currentSortType) => filters
  .map((filter) => createFilterItem(FilterTypes[filter].name, FilterTypes[filter].mod, FilterTypes[filter].name === currentSortType))
  .join('');

const createTripSortTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createFilterList(SORTING_FILTERS, currentSortType)}
  </form>`
);

export default class TripSort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripSortTemplate(this._currentSortType);
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
