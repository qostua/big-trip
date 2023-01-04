export default class AbstractObserver {
  constructor() {
    this._observers = new Set();

    this._isLoading = true;
  }

  get loadingStatus() {
    return this._isLoading;
  }

  set loadingStatus(status) {
    this._isLoading = status;
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}
