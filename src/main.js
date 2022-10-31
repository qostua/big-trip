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
