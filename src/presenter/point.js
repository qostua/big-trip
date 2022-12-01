import PointView from '../view/point-item.js';
import PointEditingView from '../view/point-item-editing.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(pointListContainer, destinations, offersData, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._destinations = destinations;
    this._offersData = offersData;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditingComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._replacePointToForm = this._replacePointToForm.bind(this);
    this._replaceFormToPoint = this._replaceFormToPoint.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditingComponent = this._pointEditingComponent;

    this._pointComponent = new PointView(point);
    this._pointEditingComponent = new PointEditingView(this._destinations, this._offersData, this._point);

    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointComponent.setRollupBtnClickHandler(this._replacePointToForm);
    this._pointEditingComponent.setRollupBtnClickHandler(this._replaceFormToPoint);
    this._pointEditingComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevPointComponent === null || prevPointEditingComponent === null) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._pointListContainer.getElement().contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._pointListContainer.getElement().contains(prevPointEditingComponent.getElement())) {
      replace(this._pointEditingComponent, prevPointEditingComponent);
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
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm() {
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
      this._replaceFormToPoint();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleFormSubmit() {
    this._replaceFormToPoint();
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }
}
