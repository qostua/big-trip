import SiteMenuView from './view/menu.js';
import StatisticsView from './view/statistics.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import SummaryPresenter from './presenter/summary.js';

import PointsModel from './model/points.js';
import OffersModel from './model/offers.js';
import DescriptionsModel from './model/descriptions.js';
import FiltersModel from './model/filters.js';

import {generateEventData} from './mock/point-item.js';
import {POINT_OFFERS_DATA} from './mock/data.js';
import {EVENT_SITY_DESCRIPTIONS} from './mock/destination.js';


import {remove, render, RenderPosition} from './utils/render.js';
import {MenuItem} from './const.js';

const EVENTS_COUNT = 20;

const points = new Array(EVENTS_COUNT).fill(null).map(() => generateEventData());

const pointsModel = new PointsModel();
pointsModel.points = points;
const offersModel = new OffersModel();
offersModel.offers = POINT_OFFERS_DATA;
const descriptionsModel = new DescriptionsModel();
descriptionsModel.descriptions = EVENT_SITY_DESCRIPTIONS;
const filtersModel = new FiltersModel();

const pageBodyNode = document.querySelector('.page-body');
const headerInnerNode = pageBodyNode.querySelector('.trip-main');
const menuWrapNode = headerInnerNode.querySelector('.trip-controls__navigation');
const filtersWrapNode = headerInnerNode.querySelector('.trip-controls__filters');
const pageMainNode = pageBodyNode.querySelector('.page-main');
const pageMainContainerNode = pageMainNode.querySelector('.page-main__container');
const tripEventsNode = pageMainContainerNode.querySelector('.trip-events');


const newPointNode = document.querySelector('.trip-main__event-add-btn');

const summaryPresenter = new SummaryPresenter(headerInnerNode, pointsModel);
summaryPresenter.init();

const tripPresenter = new TripPresenter(tripEventsNode, pointsModel, offersModel, descriptionsModel, filtersModel);
const filterPresenter = new FilterPresenter(filtersWrapNode, filtersModel);

const siteMenuComponent = new SiteMenuView(menuWrapNode);
siteMenuComponent.init();

const handleCloseNewPoint = () => {
  newPointNode.disabled = false;
};

let StatisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TRIP:
      remove(StatisticsComponent);

      tripPresenter.init();

      siteMenuComponent.setMenuItem(MenuItem.TRIP);
      filterPresenter.enableFilters();

      break;
    case MenuItem.STATS:
      tripPresenter.destroy();

      siteMenuComponent.setMenuItem(MenuItem.STATS);
      filterPresenter.disableFilters();

      StatisticsComponent = new StatisticsView(pointsModel.points);
      render(pageMainContainerNode, StatisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

newPointNode.addEventListener('click', (event) => {
  event.preventDefault();
  remove(StatisticsComponent);
  tripPresenter.destroy();

  tripPresenter.init();

  siteMenuComponent.setMenuItem(MenuItem.TRIP);
  filterPresenter.enableFilters();

  newPointNode.disabled = true;
  tripPresenter.createPoint(handleCloseNewPoint);
});

tripPresenter.init();
filterPresenter.init();
