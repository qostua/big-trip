import PointView from '../view/point-item.js';
import PointEditingView from '../view/point-item-editing.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';

export default class Point {
  constructor(pointListContainer, destinations, offersData) {
    this._pointListContainer = pointListContainer;
    this._destinations = destinations;
    this._offersData = offersData;

    this._pointComponent = null;
    this._pointEditingComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._replacePointToForm = this._replacePointToForm.bind(this);
    this._replaceFormToPoint = this._replaceFormToPoint.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditingComponent = this._pointEditingComponent;

    this._pointComponent = new PointView(point);
    this._pointEditingComponent = new PointEditingView(this._destinations, this._offersData, this._point);

    this._pointComponent.setRollupBtnClickHandler(this._replacePointToForm);
    this._pointEditingComponent.setRollupBtnClickHandler(this._replaceFormToPoint);
    this._pointEditingComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevPointComponent === null || prevPointEditingComponent === null) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._pointListContainer.contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._pointListContainer.contains(prevPointEditingComponent.getElement())) {
      replace(this._pointEditingComponent, prevPointEditingComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditingComponent);
  }

  _replacePointToForm() {
    replace(this._pointEditingComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditingComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
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
}
