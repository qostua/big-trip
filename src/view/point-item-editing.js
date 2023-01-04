import {getFormatedDateStringFromDate} from '../utils/common.js';
import {POINT_TYPES, TimeFormats} from '../const.js';
import AbstractSmart from './abstract-smart.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_FORM_EDITING = {
  type: 'flight',
  offers: null,
  destination: null,
  price: null,
  dateFrom: null,
  dateTo: null,
};

const UpdateDataMods = {
  UPDATE_ELEMENT: true,
  SAVE_ELEMENT: false,
};

const PointEditingMod = {
  NEW_POINT: 'NEW_POINT',
  EXIST_POINT: 'EXIST_POINT',
};

const createPointTypesList = (currentType) => (
  POINT_TYPES.map((pointType) => `<div class="event__type-item">
    <input
      id="event-type-${pointType}-1"
      class="event__type-input  visually-hidden"
      type="radio"
      name="event-type"
      value="${pointType}"
      ${(currentType === pointType) ? 'checked' : ''}
    >
    <label
      class="event__type-label event__type-label--${pointType}"
      for="event-type-${pointType}-1"
    >
      ${pointType}
    </label>
  </div>`).join('')
);
const createPointPrice = (isPrice, price) => (isPrice) ? String(price) : '';
const createResetBtn = (isNewPoint = true, isDeleting = true) => {
  if (isNewPoint) {
    return '<button class="event__reset-btn" type="reset">Cancel</button>';
  }

  return `<button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>`;
};
const createRollupBtn = (isNewPoint = true) => {
  if (isNewPoint) {
    return '';
  }

  return (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`
  );
};

const createOfferItem = (offer, currentOffers, id) => {
  const isCurrent = currentOffers && Boolean(currentOffers.find((currentOffer) => currentOffer.title === offer.title));
  const name = offer.title.toLowerCase().split(' ').join('-');
  const idOffer = `${name}-${id}`;

  return `<div class="event__offer-selector">
    <input
        class="event__offer-checkbox visually-hidden"
        id="${idOffer}"
        type="checkbox"
        name="event-offer-${name}"
        ${isCurrent ? 'checked' : ''}
        data-offer-title="${offer.title}"
    >
    <label class="event__offer-label" for="${idOffer}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
};
const createOffersList = (pointOffers, currentOffers, id) => {
  if (pointOffers.length === 0) {
    return '';
  }

  return pointOffers.map((offer) => createOfferItem(offer, currentOffers, id)).join('');
};
const createOffers = (pointOffers, currentOffers, id, isDisabled) => (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <fieldset class="event__available-offers" ${isDisabled ? 'disabled' : ''}>
      ${createOffersList(pointOffers, currentOffers, id)}
    </fieldset>
  </section>`
);

const createDestinationList = (destinationsData) => destinationsData
  .map((destination) => `<option value="${destination.name}"></option>`)
  .join('');
const createPointPhotos = (pictures = []) => {
  if (pictures.length === 0) {
    return '';
  }

  const photesList = pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

  return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${photesList}
    </div>
  </div>`;
};
const createDestination = (isDestination, description, pictures) => {
  if (!isDestination) {
    return '';
  }

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    ${createPointPhotos(pictures)}
  </section>`;
};
const createRollupBtn = (isNewPoint = true) => {
  if (isNewPoint) {
    return '';
  }

  return `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;
};

const createPointEditingTemplate = (destinationsData = [], offersData = [], data = {}) => {
  const {id, type, offers, destination, price, dateFrom, dateTo, isNewPoint, isDestination, isPrice, isDateFrom, isDateTo} = data;

  const isSubmitDisabled = !(isDestination && isPrice && isDateFrom && isDateTo);

  const name = (destination) ? destination.name : '';
  const description = (destination) ? destination.description : null;
  const pictures = (destination) ? destination.pictures : null;

  const dateFromHumanize = (dateFrom) ? getFormatedDateStringFromDate(dateFrom, TimeFormats.HUMANIZE) : '';
  const dateToHumanize = (dateTo) ? getFormatedDateStringFromDate(dateTo, TimeFormats.HUMANIZE) : '';

  const pointOffers = offersData.find((item) => item['type'] === type)['offers'];

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${createPointTypesList(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination" type="text" name="event-destination" value="${name}" list="destination-list">
          <datalist id="destination-list">
            ${createDestinationList(destinationsData)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time">From</label>
          <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${dateFromHumanize}">
          &mdash;
          <label class="visually-hidden" for="event-end-time">To</label>
          <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="${dateToHumanize}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price" type="text" pattern="[1-9]\\d*" name="event-price" value=${createPointPrice(isPrice, price)}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>Save</button>
        <button class="event__reset-btn" type="reset">${isNewPoint ? 'Cancel' : 'Delete'}</button>
        ${createRollupBtn(isNewPoint)}
      </header>
      <section class="event__details">
        ${createOffersList(pointOffers, offers, id)}

        ${createDestination(isDestination, description, pictures)}
      </section>
    </form>
  </li>`;
};

export default class PointEditing extends AbstractSmart {
  constructor(destinationsData = {}, offersData = [], point = BLANK_FORM_EDITING) {
    super();

    this._data = PointEditing.parsePointToData(point);
    this._destinationsData = destinationsData;
    this._offersData = offersData;

    this._pointEditingMod = this._data.isNewPoint ? PointEditingMod.NEW_POINT : PointEditingMod.EXIST_POINT;

    this._datapickerFrom = null;
    this._datapickerTo = null;

    this._typePointChangeHandler = this._typePointChangeHandler.bind(this);
    this._cityPointInputHandler = this._cityPointInputHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._pricePointInputHandler = this._pricePointInputHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._offersPointInputHandler = this._offersPointInputHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  getTemplate() {
    return createPointEditingTemplate(this._destinationsData, this._offersData, this._data);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(point) {
    this.updateData(
      PointEditing.parsePointToData(point),
    );
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this
      .getElement()
      .querySelector('.event--edit')
      .addEventListener('submit', this._formSubmitHandler);
  }

  setRollupBtnClickHandler(callback) {
    if (this._pointEditingMod === PointEditingMod.NEW_POINT) {
      return;
    }

    this._callback.rollupBtnClick = callback;
    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._rollupBtnClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this
      .getElement()
      .querySelector('.event__reset-btn')
      .addEventListener('click', this._deleteClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setRollupBtnClickHandler(this._callback.rollupBtnClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  _setInnerHandlers() {
    this
      .getElement()
      .querySelector('.event__type-group')
      .addEventListener('input', this._typePointChangeHandler);

    this
      .getElement()
      .querySelector('.event__input--destination')
      .addEventListener('input', this._cityPointInputHandler);

    this
      .getElement()
      .querySelector('.event__input--price')
      .addEventListener('input', this._pricePointInputHandler);

    this
      .getElement()
      .querySelector('.event__available-offers')
      .addEventListener('input', this._offersPointInputHandler);
  }

  _setDatepickerFrom() {
    if (this._datapickerFrom) {
      this._datapickerFrom.destroy();
      this._datapickerFrom = null;
    }

    this._datapickerFrom = flatpickr(
      this.getElement().querySelector('#event-start-time'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom,
        onChange: this._dateFromChangeHandler,
        maxDate: this._data.dateTo,
      },
    );
  }

  _setDatepickerTo() {
    if (this._datapickerTo) {
      this._datapickerTo.destroy();
      this._datapickerTo = null;
    }

    this._datapickerTo = flatpickr(
      this.getElement().querySelector('#event-end-time'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo,
        onChange: this._dateToChangeHandler,
        minDate: this._data.dateFrom,
      },
    );
  }

  //handlers methods

  _typePointChangeHandler(event) {
    event.preventDefault();
    this.updateData({
      type: event.target.value,
      offers: null,
    }, UpdateDataMods.UPDATE_ELEMENT);
  }

  _cityPointInputHandler(event) {
    event.preventDefault();

    let destination = this._destinationsData.find((item) => item.name === event.target.value);

    const isDestination = Boolean(destination);

    const isUpdate = (isDestination !== this._data.isDestination) ? UpdateDataMods.UPDATE_ELEMENT : UpdateDataMods.SAVE_ELEMENT;

    destination = isDestination ? destination : {
      name: event.target.value,
      pictures: null,
      description: null,
    };

    this.updateData({
      destination,
      isDestination,
    }, isUpdate, `#${event.target.id}`);
  }

  _dateFromChangeHandler([userDate]) {
    const isUpdate = (Boolean(userDate) !== this._data.isDateFrom && this._data.isDateTo) ? UpdateDataMods.UPDATE_ELEMENT : UpdateDataMods.SAVE_ELEMENT;

    this.updateData({
      dateFrom: userDate ? userDate.toISOString() : null,
      isDateFrom: Boolean(userDate),
    }, isUpdate, '#event-start-time');

    this._datapickerTo.set('minDate', this._data.dateFrom);
  }

  _dateToChangeHandler([userDate]) {
    const isUpdate = (Boolean(userDate) !== this._data.isDateTo && this._data.isDateFrom) ? UpdateDataMods.UPDATE_ELEMENT : UpdateDataMods.SAVE_ELEMENT;

    this.updateData({
      dateTo: userDate ? userDate.toISOString() : null,
      isDateTo: Boolean(userDate),
    }, isUpdate, '#event-end-time');

    this._datapickerFrom.set('maxDate', this._data.dateTo);
  }

  _pricePointInputHandler(event) {
    event.target.value = event.target.value.replace(/(\D|^0)/g, '');

    const isPricePrew = this._data.isPrice;
    const isPrice = event.target.value !== '';
    const isUpdate = (isPrice === isPricePrew) ? UpdateDataMods.SAVE_ELEMENT : UpdateDataMods.UPDATE_ELEMENT;

    event.preventDefault();
    this.updateData({
      price: Number(event.target.value),
      isPrice,
    }, isUpdate, `#${event.target.id}`);
  }

  _formSubmitHandler(event) {
    event.preventDefault();
    this._callback.formSubmit(PointEditing.parseDataToPoint(this._data));
  }

  _rollupBtnClickHandler(event) {
    event.preventDefault();
    this._callback.rollupBtnClick();
  }

  _deleteClickHandler(event) {
    event.preventDefault();
    this._callback.deleteClick(PointEditing.parseDataToPoint(this._data));
  }

  _offersPointInputHandler(event) {
    event.preventDefault();
    const offersWrap = event.target.closest('.event__available-offers');

    const checkedOfferTitels = Array
      .from(offersWrap.querySelectorAll('input:checked'))
      .map((input) => input.dataset.offerTitle);

    const offers = [];

    const offersPointType = this._offersData.find((offer) => offer.type === this._data.type).offers;

    checkedOfferTitels.forEach((title) => {
      const currentOffer = offersPointType.find((offer) => offer.title === title);
      offers.push(currentOffer);
    });

    this.updateData({
      offers,
    }, UpdateDataMods.SAVE_ELEMENT);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        isNewPoint: !point.id,
        isDestination: Boolean(point.destination),
        isPrice: Boolean(point.price),
        isDateFrom: Boolean(point.dateFrom),
        isDateTo: Boolean(point.dateTo),
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isNewPoint;
    delete data.isDestination;
    delete data.isPrice;
    delete data.isDate;

    return data;
  }
}
