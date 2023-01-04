import AbstractObserver from '../utils/abstract-observer.js';

export default class NewPoint extends AbstractObserver {
  constructor() {
    super();

    this._isDisabled = false;
  }

  disable() {
    this._isDisabled = true;
    this._notify();
  }

  enable() {
    this._isDisabled = false;
    this._notify();
  }

  isDisabled() {
    return this._isDisabled;
  }
}
