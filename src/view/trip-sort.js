import AbstractView from './abstract.js';

const FILTERS_SORTING = [
  'day',
  'event',
  'time',
  'price',
  'offers',
];

const createFilterItemTemplate = (filter, isChecked) => (
  `<div class="trip-sort__item  trip-sort__item--${filter}">
    <input
      id="sort-${filter}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${filter}"
      ${isChecked ? 'checked' : ''}
    >
    <label class="trip-sort__btn" for="sort-${filter}">
      ${filter}
    </label>
  </div>`
);

const createFilterListTemplate = (filters) => filters
  .map((filter, index) => createFilterItemTemplate(filter, index === 0))
  .join('');

const createTripSortTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createFilterListTemplate(FILTERS_SORTING)}
  </form>`
);

export default class TripSort extends AbstractView {
  getTemplate() {
    return createTripSortTemplate();
  }
}
