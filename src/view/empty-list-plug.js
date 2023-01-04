import AbstractView from './abstract.js';

const PLUG_TO_FILTERS = {
  'everything': 'Click New Event to create your first point',
  'past': 'There are no past events now',
  'future': 'There are no future events now',
};

const createEmptyListPlugTemplate = (activeFilter = 'everthing') => (
  `<p class="trip-events__msg">
    ${PLUG_TO_FILTERS[activeFilter]}
  </p>`
);

export default class EmptyListPlug extends AbstractView {
  constructor(activeFilter) {
    super();

    this._activeFilter = activeFilter;
  }

  getTemplate() {
    return createEmptyListPlugTemplate(this._activeFilter);
  }
}
