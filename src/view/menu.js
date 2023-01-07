import AbstractView from './abstract.js';

import {remove, render, replace, RenderPosition} from '../utils/render.js';
import {MenuItem} from '../const.js';

const createMenuItemTemplate = (item, isActive) => (
  `<a
    href="#"
    class="trip-tabs__btn ${isActive ? 'trip-tabs__btn--active' : ''}"
    data-item="${item.toLowerCase()}"
  >
    ${item}
  </a>`
);

const createItemListTemplate = (items) => items
  .map((item, index) => createMenuItemTemplate(item, index === 0))
  .join('');

const createSiteMenuTemplate = () => (
  `<div class="trip-controls__navigation">
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${createItemListTemplate(Object.values(MenuItem))}
    </nav>
  </div>`
);

export default class SiteMenu extends AbstractView {
  constructor(menuContainer) {
    super();

    this._menuContainer = menuContainer;

    this._menuComponent = null;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  init() {
    const prevMenuComponent = this._menuComponent;

    this._menuComponent = this.getElement();

    if (prevMenuComponent === null) {
      render(this._menuContainer, this._menuComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._menuContainer, prevMenuComponent);
    remove(prevMenuComponent);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setMenuItem(menuItem) {
    this._resetMenu();

    this.getElement().querySelector(`.trip-tabs__btn[data-item="${menuItem}"]`).classList.add('trip-tabs__btn--active');
  }

  setMenuClickHandler(callback) {
    this._callback.menuClickHandler = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  _resetMenu() {
    const menuItems = this.getElement().querySelectorAll('.trip-tabs__btn');
    menuItems.forEach((item) => item.classList.remove('trip-tabs__btn--active'));
  }

  _menuClickHandler(event) {
    event.preventDefault();
    if (event.target.classList.contains('trip-tabs__btn--active')) {
      return;
    }

    const menuItem = event.target.closest('.trip-tabs__btn');
    this._callback.menuClickHandler(menuItem.dataset.item);
  }
}
