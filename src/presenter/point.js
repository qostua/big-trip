import PointView from '../view/point-item.js';
import PointEditingView from '../view/point-item-editing.js';

import {remove, render, replace, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Point {
  constructor(pointListContainer, offers, destinations, changeData, changeMode, isPointDataLoading) {
    this._pointListContainer = pointListContainer;
    this._offersData = offers;
    this._destinations = destinations;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._isPointDataLoading = isPointDataLoading;

    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._pointEditingComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._replacePointToForm = this._replacePointToForm.bind(this);
    this._replaceFormToPoint = this._replaceFormToPoint.bind(this);
    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditingComponent = this._pointEditingComponent;

    this._pointComponent = new PointView(point, this._isPointDataLoading);
    this._pointEditingComponent = new PointEditingView(this._destinations, this._offersData, this._point);

    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointComponent.setRollupBtnClickHandler(this._replacePointToForm);

    this._pointEditingComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditingComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointEditingComponent.setRollupBtnClickHandler(this._rollupBtnClickHandler);

    if (prevPointComponent === null || prevPointEditingComponent === null) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditingComponent, prevPointEditingComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditingComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditingComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._pointEditingComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._pointEditingComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditingComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditingComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditingComponent.shake(resetFormState);
        break;
    }
  }

  _replacePointToForm() {
    if (this._isPointDataLoading) {
      return;
    }

    replace(this._pointEditingComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditingComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this._pointEditingComponent.reset(this._point);
      this._replaceFormToPoint();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _rollupBtnClickHandler() {
    this._pointEditingComponent.reset(this._point);
    this._replaceFormToPoint();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    const updateType = (
      point.dateFrom !== this._point.dateFrom ||
      point.dateTo !== this._point.dateTo ||
      point.price !== this._point.price
    ) ? UpdateType.MINOR : UpdateType.PATCH;

    this._changeData(
      UserAction.UPDATE_POINT,
      updateType,
      point,
    );
  }

  _handleDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
