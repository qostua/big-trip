import AbstractObserver from '../utils/abstract-observer.js';

export default class Descriptions extends AbstractObserver {
  constructor() {
    super();
    this._descriptions = [];
  }

  set descriptions(descriptions) {
    this._descriptions = descriptions.slice();
  }

  get descriptions() {
    return this._descriptions;
  }
}
