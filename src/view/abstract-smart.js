import Abstract from './abstract';

export default class AbstractSmart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update, isUpdateElement = true, focusedElementSelector) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (isUpdateElement) {
      this.updateElement(focusedElementSelector);
    }
  }

  updateElement(focusedElementSelector) {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();

    if (!focusedElementSelector) {
      return;
    }
    const focusedElement = newElement.querySelector(focusedElementSelector);

    if (!focusedElement) {
      return;
    }
    focusedElement.focus();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
