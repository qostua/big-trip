import {POINT_TYPES} from '../const.js';
import {getDateFromDateString} from '../utils.js';

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
const createDestinationList = (destinationsData) => destinationsData
  .map((destination) => `<option value="${destination.name}"></option>`)
  .join('');
const createOffersList = (pointOffers, currentOffers) => {
  const offers = pointOffers.map((offer) => {
    const isCurrent = currentOffers && Boolean(currentOffers.find((currentOffer) => currentOffer.title === offer.title));
    const id = offer.title.toLowerCase().split(' ').join('-');

    return `<div class="event__offer-selector">
      <input
          class="event__offer-checkbox visually-hidden"
          id="${id}"
          type="checkbox"
          name="${id}"
          ${isCurrent ? 'checked' : ''}
      >
      <label class="event__offer-label" for="${id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  });

  if (offers.length === 0) {
    return '';
  }

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offers.join('')}
    </div>
  </section>`;
};
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
const createDestination = (description, pictures) => {
  if (!description) {
    return '';
  }

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    ${createPointPhotos(pictures)}
  </section>`;
};
const createRollupBtn = (isEditingForm = false) => {
  if (!isEditingForm) {
    return '';
  }

  return `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;
};

export const createPointEditingTemplate = (destinationsData = [], offersData = [], pointData = {}) => {
  const isEditingForm = 'type' in pointData;

  const {
    type = 'flight',
    offers = null,
    destination,
    price = 0,
    dateFrom = null,
    dateTo = null,
  } = pointData;


  const name = (destination) ? destination.name : '';
  const description = (destination) ? destination.description : null;
  const pictures = (destination) ? destination.pictures : null;

  const startDate = (dateFrom) ? getDateFromDateString(dateFrom) : '';
  const endDate = (dateTo) ? getDateFromDateString(dateTo) : '';

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
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${price}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        ${createRollupBtn(isEditingForm)}
      </header>
      <section class="event__details">
        ${createOffersList(pointOffers, offers)}

        ${createDestination(description, pictures)}
      </section>
    </form>
  </li>`;
};

