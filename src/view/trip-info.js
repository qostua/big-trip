import AbstractView from './abstract.js';
import {getDatesDifferencePerMs, getFormatedDateFromDateString} from '../utils/common.js';

const createCitiesTitle = (cities) => cities.join(' &mdash; ');
const createDateRange = (dates) => {
  const sortDates = dates
    .slice()
    .sort((dateA, dateB) => getDatesDifferencePerMs(dateB, dateA));

  const firstDate = sortDates[0];
  const lastDate = sortDates[sortDates.length - 1];

  const firstMonth = getFormatedDateFromDateString(firstDate, 'MMM');
  const lastMonth = getFormatedDateFromDateString(lastDate, 'MMM');

  return (firstMonth === lastMonth)
    ? `${getFormatedDateFromDateString(firstDate, 'MMM D')} - ${getFormatedDateFromDateString(lastDate, 'D')}`
    : `${getFormatedDateFromDateString(firstDate, 'MMM D')} - ${getFormatedDateFromDateString(lastDate, 'MMM D')}`;
};

const createTripInfoTemplate = (cities, dates) => {
  if (cities.length === 0) {
    return null;
  }
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${createCitiesTitle(cities)}</h1>

      <p class="trip-info__dates">${createDateRange(dates)}</p>
    </div>
  </section>`;
};

export default class TripInfo extends AbstractView {
  constructor(cities, dates) {
    super();
    this._cities = cities;
    this._dates = dates;
  }

  getTemplate() {
    return createTripInfoTemplate(this._cities, this._dates);
  }
}
