import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createMenuItemTemplate = (item, isActive) => (
  `<a class="trip-tabs__btn  ${isActive ? 'trip-tabs__btn--active' : ''}" href="#">
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
  getTemplate() {
    return createSiteMenuTemplate();
  }
}
