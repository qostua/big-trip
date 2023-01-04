import PointsModel from './model/points.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import FiltersModel from './model/filters.js';
import NewPointModel from './model/new-point.js';

import SiteMenuView from './view/menu.js';
import StatisticsView from './view/statistics.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import SummaryPresenter from './presenter/summary.js';
import BtnNewPointPresenter from './presenter/btn-new-point.js';

import Api from './api/api.js';

import {remove, render, RenderPosition} from './utils/render.js';
import {MenuItem, UpdateType} from './const.js';

const AUTHORIZATION = 'Basic Nyfks9qr8gjdRAaG';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const descriptionsModel = new DestinationsModel();
const filtersModel = new FiltersModel();
const newPointModel = new NewPointModel();

const headerInnerNode = document.querySelector('.trip-main');
const tripControlsNode = headerInnerNode.querySelector('.trip-controls');
const pageMainContainerNode = document.querySelector('.page-main__container');

const tripPresenter = new TripPresenter(pageMainContainerNode, pointsModel, offersModel, descriptionsModel, filtersModel, api);
const siteMenuComponent = new SiteMenuView(tripControlsNode);
siteMenuComponent.init();
const filterPresenter = new FilterPresenter(tripControlsNode, filtersModel, pointsModel);
const summaryPresenter = new SummaryPresenter(headerInnerNode, pointsModel);

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

      StatisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pageMainContainerNode, StatisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const handleBtnNewPointClick = () => {
  newPointModel.disable();
  remove(StatisticsComponent);

  tripPresenter.destroy();
  tripPresenter.init();

  siteMenuComponent.setMenuItem(MenuItem.TRIP);
  filterPresenter.enableFilters();

  tripPresenter.createPoint(() => newPointModel.enable());
};

const btnNewPointPresenter = new BtnNewPointPresenter(headerInnerNode, handleBtnNewPointClick, newPointModel, offersModel, descriptionsModel);

tripPresenter.init();
filterPresenter.init();
summaryPresenter.init();

api.getOffers()
  .then((offers) => {
    offersModel.setOffers(UpdateType.MAJOR, offers);
  })
  .catch(() => {
    offersModel.setOffers(UpdateType.MAJOR, []);
  });

api.getDestinations()
  .then((destinations) => {
    descriptionsModel.setDestinations(UpdateType.MAJOR, destinations);
  }).catch(() => {
    descriptionsModel.setDestinations(UpdateType.MAJOR, []);
  });

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.MAJOR, points);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    btnNewPointPresenter.init();
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.MAJOR, []);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    btnNewPointPresenter.init();
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});
