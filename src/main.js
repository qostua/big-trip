import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createSiteMenu} from './view/menu.js';
import {createTripFilters} from './view/filters.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createPointsList} from './view/points-list.js';
import {createPointTemplate} from './view/point-item.js';
import {createPointEditingTemplate} from './view/form-editing.js';

import {generateEventData} from './mock/point-item.js';
import {POINT_OFFERS} from './mock/data.js';
import {generateDescriptionsData} from './mock/destination.js';
import {generateTripCitiesArray, getTotalCost, getDateRange} from './mock/trip-info.js';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(() => generateEventData());
const tripCities = generateTripCitiesArray(events);
const tripCost = getTotalCost(events);
const tripDateRange = getDateRange(events);
const destinations = generateDescriptionsData();

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageBodyNode = document.querySelector('.page-body');
const headerInnerNode = pageBodyNode.querySelector('.trip-main');
const menuWrapNode = headerInnerNode.querySelector('.trip-controls__navigation');
const filtersWrapNode = headerInnerNode.querySelector('.trip-controls__filters');
const pageMainNode = pageBodyNode.querySelector('.page-main');
const tripEventsNode = pageMainNode.querySelector('.trip-events');

renderTemplate(headerInnerNode, createTripInfoTemplate(tripCities, tripDateRange), 'afterbegin');

const tripInfoNode = pageBodyNode.querySelector('.trip-info');

renderTemplate(tripInfoNode, createTripCostTemplate(tripCost), 'beforeend');
renderTemplate(menuWrapNode, createSiteMenu(), 'beforeend');
renderTemplate(filtersWrapNode, createTripFilters(), 'beforeend');

renderTemplate(tripEventsNode, createTripSortTemplate(), 'afterbegin');
renderTemplate(tripEventsNode, createPointsList(), 'beforeend');

const eventsListNode = pageMainNode.querySelector('.trip-events__list');

for (let i = 1; i < EVENTS_COUNT; i++) {
  renderTemplate(eventsListNode, createPointTemplate(events[i]), 'beforeend');
}

renderTemplate(eventsListNode, createPointEditingTemplate(destinations, POINT_OFFERS, events[0]), 'afterbegin');
