import AbstractObserver from '../utils/abstract-observer.js';

export default class Destinations extends AbstractObserver {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(updateType, destinations) {
    this._destinations = destinations.slice();
    this.loadingStatus = false;

    this._notify(updateType);
  }

  getDestinations() {
    return this._destinations;
  }
}
