import PointEditingView from '../view/point-item-editing.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewPoint {
  constructor(pointsContainer, offers, destinations, changeData) {
    this._pointsContainer = pointsContainer;
    this._destinations = destinations;
    this._offersData = offers;
    this._changeData = changeData;

    this._pointEditingComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCanselClick = this._handleCanselClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._pointEditingComponent !== null) {
      return;
    }

    this._pointEditingComponent = new PointEditingView(this._destinations, this._offersData);

    this._pointEditingComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditingComponent.setDeleteClickHandler(this._handleCanselClick);

    render(this._pointsContainer, this._pointEditingComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditingComponent === null) {
      return;
    }

    remove(this._pointEditingComponent);
    this._pointEditingComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this.destroy();
  }

  _handleCanselClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
