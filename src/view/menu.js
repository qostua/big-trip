import AbstractView from './abstract.js';

const MENU_ITEMS = [
  'table',
  'stats',
];

const createMenuItemTemplate = (item, isActive) => (
  `<a class="trip-tabs__btn  ${isActive ? 'trip-tabs__btn--active' : ''}" href="#">
    ${item}
  </a>`
);

const createItemListTemplate = (items) => items
  .map((item, index) => createMenuItemTemplate(item, index === 1))
  .join('');

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${createItemListTemplate(MENU_ITEMS)}
  </nav>`
);

export default class SiteMenu extends AbstractView {
  getTemplate() {
    return createSiteMenuTemplate();
  }
}
