import {
  createElement,
  getDatesDifferencePerMs,
  getFormatedDateFromDateString,
  msToHumanizeTime
} from '../utils.js';

const createOffersList = (offers) => offers.map((offer) => `<li class="event__offer">
  <span class="event__offer-title">${offer.title}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${offer.price}</span>
</li>`).join('');

const createPointTemplate = (pointData) => {
  const {type, offers, destination, price, isFavorite, dateFrom, dateTo} = pointData;

  const name = destination.name;

  const day = getFormatedDateFromDateString(dateFrom, 'MMM D');
  const startTime = getFormatedDateFromDateString(dateFrom, 'HH:MM');
  const endTime = getFormatedDateFromDateString(dateTo, 'HH:MM');
  const timeDiff = msToHumanizeTime(getDatesDifferencePerMs(dateFrom, dateTo));
  const datetimeEventData = getFormatedDateFromDateString(dateFrom, '2019-03-18');

  const favoriteClassName = (isFavorite) ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${datetimeEventData}">${day}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${datetimeEventData}T${startTime}">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${datetimeEventData}T${endTime}">${endTime}</time>
        </p>
        <p class="event__duration">${timeDiff}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersList(offers)}
      </ul>
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Point {
  constructor(pointData) {
    this._element = null;
    this._pointData = pointData;
  }

  getTemplate() {
    return createPointTemplate(this._pointData);
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
