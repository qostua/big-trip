import {getFormatedDateFromDateString} from '../utils/common.js';
import {POINT_TYPES, TimeFormats} from '../const.js';
import AbstractView from './abstract.js';

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
      for="event-type-${pointType}-1">${pointType}
    </label>
  </div>`).join('')
);
const createPointPrice = (isPrice, price) => (isPrice) ? String(price) : '';
const createOffersList = (pointOffers, currentOffers, id) => {
  const offers = pointOffers.map((offer) => {
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
  });

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offers.join('')}
    </div>
  </section>`;
};
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
  const {id, type, offers, destination, price, dateFrom, dateTo, isNewPoint, isDestination, isPrice, isDate} = data;

  const isSubmitDisabled = !(isPrice && isDate);

  const name = (destination) ? destination.name : '';
  const description = (destination) ? destination.description : null;
  const pictures = (destination) ? destination.pictures : null;

  const dateFromHumanize = (dateFrom) ? getFormatedDateFromDateString(dateFrom, TimeFormats.HUMANIZE) : '';
  const dateToHumanize = (dateTo) ? getFormatedDateFromDateString(dateTo, TimeFormats.HUMANIZE) : '';

  const pointOffers = offersData.find((item) => item['type'] === type)['offers'];

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${createPointTypesList(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
          <datalist id="destination-list-1">
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
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${createPointPrice(isPrice, price)}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        ${createRollupBtn(isNewPoint)}
      </header>
      <section class="event__details">
        ${createOffersList(pointOffers, offers, id)}

        ${createDestination(isDestination, description, pictures)}
      </section>
    </form>
  </li>`;
};

export default class PointEditing extends AbstractView {
  constructor(destinationsData = {}, offersData = [], point = BLANK_FORM_EDITING) {
    super();

    this._destinationsData = destinationsData;
    this._data = PointEditing.parsePointToData(point);
    this._offersData = offersData;

    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typePointChangeHandler = this._typePointChangeHandler.bind(this);
    this._cityPointInputHandler = this._cityPointInputHandler.bind(this);
    this._dateToPointInputHandler = this._dateToPointInputHandler.bind(this);
    this._dateFromPointInputHandler = this._dateFromPointInputHandler.bind(this);
    this._pricePointInputHandler = this._pricePointInputHandler.bind(this);
    this._offersPointInputHandler = this._offersPointInputHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPointEditingTemplate(this._destinationsData, this._offersData, this._data);
  }

  updateData(update, isUpdateElement = true) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (isUpdateElement) {
      this.updateElement();
    }
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  _formSubmitHandler(event) {
    event.preventDefault();
    this._callback.formSubmit(PointEditing.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this
      .getElement()
      .querySelector('.event--edit')
      .addEventListener('submit', this._formSubmitHandler);
  }

  _rollupBtnClickHandler(event) {
    event.preventDefault();
    this._callback.rollupBtnClick();
  }

  setRollupBtnClickHandler(callback) {
    this._callback.rollupBtnClick = callback;
    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._rollupBtnClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setRollupBtnClickHandler(this._callback.rollupBtnClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
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
      .querySelector('#event-start-time')
      .addEventListener('input', this._dateFromPointInputHandler);

    this
      .getElement()
      .querySelector('#event-end-time')
      .addEventListener('input', this._dateToPointInputHandler);

    this
      .getElement()
      .querySelector('.event__input--price')
      .addEventListener('input', this._pricePointInputHandler);

    this
      .getElement()
      .querySelector('.event__available-offers')
      .addEventListener('input', this._offersPointInputHandler);
  }

  //handlers methods

  _typePointChangeHandler(event) {
    event.preventDefault();
    this.updateData({
      type: event.target.value,
      offers: null,
    });
  }

  _cityPointInputHandler(event) {
    event.preventDefault();

    const destination = this._destinationsData.find((item) => item.name === event.target.value);

    if (!destination) {
      return;
    }

    this.updateData({
      destination,
    });
  }

  _dateFromPointInputHandler(event) {
    event.preventDefault();
    this.updateData({
      dateFrom: getFormatedDateFromDateString(event.target.value, TimeFormats.DATA),
    }, UpdateDataMods.SAVE_ELEMENT);
  }

  _dateToPointInputHandler(event) {
    event.preventDefault();
    this.updateData({
      dateTo: getFormatedDateFromDateString(event.target.value, TimeFormats.DATA),
    }, UpdateDataMods.SAVE_ELEMENT);
  }

  _pricePointInputHandler(event) {
    event.preventDefault();
    this.updateData({
      price: event.target.value,
    }, UpdateDataMods.SAVE_ELEMENT);
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
        isNewPoint: !point.dateFrom,
        isDestination: Boolean(point.destination),
        isPrice: Boolean(point.price),
        isDate: Boolean(point.dateFrom) && Boolean(point.dateTo),
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
