import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createSiteMenu} from './view/menu.js';
import {createTripFilters} from './view/filters.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createEventsList} from './view/events-list.js';
import {createEventPointTemplate} from './view/event-item.js';
import {createEventAddingTemplate} from './view/form-adding.js';
import {createEventEditingTemplate} from './view/form-editing.js';

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageBodyNode = document.querySelector('.page-body');
const headerInnerNode = pageBodyNode.querySelector('.trip-main');
const menuWrapNode = headerInnerNode.querySelector('.trip-controls__navigation');
const filtersWrapNode = headerInnerNode.querySelector('.trip-controls__filters');
const pageMainNode = pageBodyNode.querySelector('.page-main');
const tripEventsNode = pageMainNode.querySelector('.trip-events');

renderTemplate(headerInnerNode, createTripInfoTemplate(), 'afterbegin');

const tripInfoNode = pageBodyNode.querySelector('.trip-info');

renderTemplate(tripInfoNode, createTripCostTemplate(), 'beforeend');
renderTemplate(menuWrapNode, createSiteMenu(), 'beforeend');
renderTemplate(filtersWrapNode, createTripFilters(), 'beforeend');

renderTemplate(tripEventsNode, createTripSortTemplate(), 'afterbegin');
renderTemplate(tripEventsNode, createEventsList(), 'beforeend');

const eventsListNode = pageMainNode.querySelector('.trip-events__list');

for (let i = 0; i < 3; i++) {
  renderTemplate(eventsListNode, createEventPointTemplate(), 'beforeend');
}

renderTemplate(eventsListNode, createEventEditingTemplate(), 'afterbegin');
