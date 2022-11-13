import {createElement} from '../utils.js';

const LIST_PLUG_TO_FILTERS = {
  'everthing': 'Click New Event to create your first point',
  'past': 'There are no past events now',
  'future': 'There are no future events now',
};

const createEmptyListPlugTemplate = (activeFilter = 'everthing') => (
  `<p class="trip-events__msg">${LIST_PLUG_TO_FILTERS[activeFilter]}</p>`
);

export default class EmptyListPlug {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyListPlugTemplate();
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
