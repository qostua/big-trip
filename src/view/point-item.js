import AbstractView from './abstract.js';

import {getDatesDifferencePerMs, getFormatedDateStringFromDate, msToHumanizeTime} from '../utils/time.js';
import {TimeFormats} from '../const.js';

const createOfferItem = (offer) => (
  `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span> &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
  </li>`
);

const createOffersList = (isOffers, offers) => {
  if (!isOffers) {
    return '';
  }

  return (
    `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${offers.map((offer) => createOfferItem(offer)).join('')}
    </ul>`
  );
};

const createPointTemplate = (pointData, isRollupDisabled) => {
  const {type, offers, destination, price, isFavorite, dateFrom, dateTo} = pointData;

  const name = destination.name;

  const day = getFormatedDateStringFromDate(dateFrom, TimeFormats.DAY);
  const startTime = getFormatedDateStringFromDate(dateFrom, TimeFormats.TIME);
  const endTime = getFormatedDateStringFromDate(dateTo, TimeFormats.TIME);
  const timeDiff = msToHumanizeTime(getDatesDifferencePerMs(dateFrom, dateTo));
  const dateEventTime = getFormatedDateStringFromDate(dateFrom, TimeFormats.DATE);

  const isOffers = offers && offers.length !== 0;

  const favoriteClassName = (isFavorite) ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateEventTime}">${day}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateEventTime}T${startTime}">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateEventTime}T${endTime}">${endTime}</time>
        </p>
        <p class="event__duration">${timeDiff}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${createOffersList(isOffers, offers)}
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button" ${isRollupDisabled ? 'disabled' : ''}>
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Point extends AbstractView {
  constructor(pointData, isPointDataLoading) {
    super();

    this._pointData = pointData;
    this._isPointDataLoading = isPointDataLoading;

    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._pointData, this._isPointDataLoading);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  setRollupBtnClickHandler(callback) {
    this._callback.rollupBtnClick = callback;
    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._rollupBtnClickHandler);
  }

  _favoriteClickHandler(event) {
    event.preventDefault();
    this._callback.favoriteClick();
  }

  _rollupBtnClickHandler(event) {
    event.preventDefault();
    this._callback.rollupBtnClick();
  }
}

