import AbstractView from './abstract.js';

import {FilterType} from '../const.js';

const createFilterItem = (filter, isChecked, isDisabled) => (
  `<div class="trip-filters__filter">
    <input
      id="filter-${filter.type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${filter.type}" ${isChecked ? 'checked' : ''}
      ${filter.isEmpty || isDisabled ? 'disabled' : ''}
    >
    <label class="trip-filters__filter-label" for="filter-${filter.type}">
      ${filter.type}
    </label>
  </div>`
);

const createFilterList = (filters, currentFilterType, isDisabled) => filters
  .map((filter) => createFilterItem(filter, filter.type === currentFilterType, isDisabled))
  .join('');

const createTripFiltersTemplate = (filters, currentFilterType, isDisabled) => (
  `<div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${createFilterList(filters, currentFilterType, isDisabled)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`
);

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType = FilterType.EVERYTHING, isDisabled = 'false') {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._isDisabled = isDisabled;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters, this._currentFilter, this._isDisabled);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(event) {
    event.preventDefault();
    this._callback.filterTypeChange(event.target.value);
  }
}
