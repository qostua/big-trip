import BtnNewPointView from '../view/btn-new-point.js';

import {remove, render, replace, RenderPosition} from '../utils/render.js';

export default class BtnNewPoint {
  constructor(btnNewPointContainer, btnNewPointClickHandler, newPointModel, offersModel, descriptionsModel) {
    this._btnNewPointContainer = btnNewPointContainer;
    this._btnNewPointClickHandler = btnNewPointClickHandler;
    this._newPointModel = newPointModel;
    this._offersModel = offersModel;
    this._descriptionsModel = descriptionsModel;

    this._btnNewPointComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._newPointModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._descriptionsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevBtnNewPointComponent = this._btnNewPointComponent;

    this._btnNewPointComponent = new BtnNewPointView(this._isDisabled());
    this._btnNewPointComponent.setBtnNewPointClickHandler(this._btnNewPointClickHandler);

    if (prevBtnNewPointComponent === null) {
      render(this._btnNewPointContainer, this._btnNewPointComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._btnNewPointComponent, prevBtnNewPointComponent);
    remove(prevBtnNewPointComponent);
  }

  _isDisabled() {
    return this._newPointModel.isDisabled() || this._getPointDataLoadingStatus();
  }

  _getPointDataLoadingStatus() {
    return this._offersModel.loadingStatus || this._descriptionsModel.loadingStatus;
  }

  _handleModelEvent() {
    this.init();
  }
}
