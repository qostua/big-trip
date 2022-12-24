import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';

const createMenuItemTemplate = (item, isActive) => (
  `<a class="trip-tabs__btn  ${isActive ? 'trip-tabs__btn--active' : ''}" href="#" data-item="${item.toLowerCase()}">
    ${item}
  </a>`
);

const createItemListTemplate = (items) => items
  .map((item, index) => createMenuItemTemplate(item, index === 0))
  .join('');

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${createItemListTemplate(Object.values(MenuItem))}
  </nav>`
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

  _menuClickHandler(event) {
    event.preventDefault();
    const menuItem = event.target.closest('.trip-tabs__btn');
    this._callback.menuClickHandler(menuItem.dataset.item);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClickHandler = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    this._resetMenu();

    this.getElement().querySelector(`.trip-tabs__btn[data-item="${menuItem}"]`).classList.add('trip-tabs__btn--active');
  }

  _resetMenu() {
    const menuItems = this.getElement().querySelectorAll('.trip-tabs__btn');
    menuItems.forEach((item) => item.classList.remove('trip-tabs__btn--active'));
  }
}
