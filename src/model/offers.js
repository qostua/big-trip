import AbstractObserver from '../utils/abstract-observer.js';

export default class Offers  extends AbstractObserver {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(updateType, offers) {
    this._offers = offers.slice();
    this.loadingStatus = false;

    this._notify(updateType);
  }

  getOffers() {
    return this._offers;
  }
}
