import PointEditingView from '../view/point-item-editing.js';

import {render, remove, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointEditing {
  constructor(pointsContainer, offers, destinations, changeData) {
    this._pointsContainer = pointsContainer;
    this._offersData = offers;
    this._destinations = destinations;
    this._changeData = changeData;

    this._destroyCallback = null;

    this._pointEditingComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCanselClick = this._handleCanselClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._pointEditingComponent !== null) {
      return;
    }

    this._pointEditingComponent = new PointEditingView(this._destinations, this._offersData);

    this._pointEditingComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditingComponent.setDeleteClickHandler(this._handleCanselClick);

    render(this._pointsContainer, this._pointEditingComponent, RenderPosition.AFTERBEGIN);
    this._pointEditingComponent.setFocus();

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditingComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._pointEditingComponent);
    this._pointEditingComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._pointEditingComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditingComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointEditingComponent.shake(resetFormState);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleCanselClick() {
    this.destroy();
  }
}
