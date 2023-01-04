import Abstract from './abstract.js';

const createBtnNewPointTemplate = (isDisabled) => (
  `<button
    class="trip-main__event-add-btn  btn  btn--big  btn--yellow"
    type="button"
    ${isDisabled ? 'disabled' : ''}
  >
    New event
  </button>`
);

export default class BtnNewPoint extends Abstract {
  constructor(isDisabled) {
    super();

    this._isDisabled = isDisabled;

    this._btnNewPointClickHandler = this._btnNewPointClickHandler.bind(this);
  }

  getTemplate() {
    return createBtnNewPointTemplate(this._isDisabled);
  }

  setBtnNewPointClickHandler(callback) {
    this._callback.btnNewPointClick = callback;
    this.getElement().addEventListener('click', this._btnNewPointClickHandler);
  }

  _btnNewPointClickHandler(event) {
    event.preventDefault();
    this._callback.btnNewPointClick();
  }
}
