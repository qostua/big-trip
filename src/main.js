import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import SiteMenuView from './view/menu.js';
import TripFiltersView from './view/filters.js';

import TripPresenter from './presenter/trip.js';

import {generateEventData} from './mock/point-item.js';
import {POINT_OFFERS_DATA} from './mock/data.js';
import {EVENT_SITY_DESCRIPTIONS} from './mock/destination.js';
import {generateTripCitiesArray, getTotalCost, getDateRange} from './mock/trip-info.js';

import {render, RenderPosition} from './utils/render.js';

const EVENTS_COUNT = 20;

const points = new Array(EVENTS_COUNT).fill(null).map(() => generateEventData());
const tripCities = generateTripCitiesArray(points);
const tripCost = getTotalCost(points);
const tripDates = getDateRange(points);

const pageBodyNode = document.querySelector('.page-body');
const headerInnerNode = pageBodyNode.querySelector('.trip-main');
const menuWrapNode = headerInnerNode.querySelector('.trip-controls__navigation');
const filtersWrapNode = headerInnerNode.querySelector('.trip-controls__filters');
const pageMainNode = pageBodyNode.querySelector('.page-main');
const tripEventsNode = pageMainNode.querySelector('.trip-events');

if (points.length !== 0) {
  const tripInfoComponent = new TripInfoView(tripCities, tripDates);
  render(headerInnerNode, tripInfoComponent, RenderPosition.AFTERBEGIN);
  render(tripInfoComponent, new TripCostView(tripCost), RenderPosition.BEFOREEND);
}

render(menuWrapNode, new SiteMenuView(), RenderPosition.BEFOREEND);
render(filtersWrapNode, new TripFiltersView(), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripEventsNode, EVENT_SITY_DESCRIPTIONS, POINT_OFFERS_DATA);

tripPresenter.init(points);
