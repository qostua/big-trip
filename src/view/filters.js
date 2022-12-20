import AbstractView from './abstract.js';
import {FiltersType} from '../const.js';

const createFilterItem = (filter, isChecked) => (
  `<div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${isChecked ? 'checked' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
  </div>`
);

const createFilterList = (filters) => filters
  .map((filter, index) => createFilterItem(filter, index === 0))
  .join('');

const createTripFiltersTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
    ${createFilterList(Object.values(FiltersType))}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class TripFilters extends AbstractView {
  getTemplate() {
    return createTripFiltersTemplate();
  }
}
