import AbstractView from './abstract.js';

const createFilterItem = (filter, isChecked) => (
  `<div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${isChecked ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
  </div>`
);

const createFilterList = (filters, currentFilterType) => filters
  .map((filter) => createFilterItem(filter, filter === currentFilterType))
  .join('');

const createTripFiltersTemplate = (filters, currentFilterType) => (
  `<form class="trip-filters" action="#" method="get">
    ${createFilterList(filters, currentFilterType)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType = 'everything') {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(event) {
    event.preventDefault();
    this._callback.filterTypeChange(event.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
