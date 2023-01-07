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

import Store from './api/store.js';
import Provider from './api/provider.js';
import Api from './api/api.js';

import {remove, render, RenderPosition} from './utils/render.js';
import {isOnline} from './utils/common.js';
import {toast} from './utils/toast.js';
import {MenuItem, UpdateType} from './const.js';

const AUTHORIZATION = 'Basic Nyfks9qs8sedRA5G';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v1';
const POINTS_STORE_NAME = `points-${STORE_PREFIX}-${STORE_VER}`;
const OFFERS_STORE_NAME = `odders-${STORE_PREFIX}-${STORE_VER}`;
const DESTINATIONS_STORE_NAME = `destinations-${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const pointsStore = new Store(POINTS_STORE_NAME, window.localStorage);
const offersStore = new Store(OFFERS_STORE_NAME, window.localStorage);
const destinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, pointsStore, offersStore, destinationsStore);

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const descriptionsModel = new DestinationsModel();
const filtersModel = new FiltersModel();
const newPointModel = new NewPointModel();

const headerInnerNode = document.querySelector('.trip-main');
const tripControlsNode = headerInnerNode.querySelector('.trip-controls');
const pageMainContainerNode = document.querySelector('.page-main__container');

const tripPresenter = new TripPresenter(pageMainContainerNode, pointsModel, offersModel, descriptionsModel, filtersModel, apiWithProvider);
const siteMenuComponent = new SiteMenuView(tripControlsNode);
siteMenuComponent.init();
const filterPresenter = new FilterPresenter(tripControlsNode, filtersModel, pointsModel);
const summaryPresenter = new SummaryPresenter(headerInnerNode, pointsModel);

let StatisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TRIP:
      remove(StatisticsComponent);
      tripPresenter.destroy();

      tripPresenter.init();

      siteMenuComponent.setMenuItem(MenuItem.TRIP);
      filterPresenter.enableFilters();

      break;
    case MenuItem.STATS:
      remove(StatisticsComponent);
      tripPresenter.destroy();

      siteMenuComponent.setMenuItem(MenuItem.STATS);
      filterPresenter.disableFilters();

      StatisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pageMainContainerNode, StatisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const handleBtnNewPointClick = () => {
  if (!isOnline()) {
    toast('You can\'t create new task offline');

    return;
  }

  remove(StatisticsComponent);

  tripPresenter.destroy();
  tripPresenter.init();

  siteMenuComponent.setMenuItem(MenuItem.TRIP);
  filterPresenter.enableFilters();

  newPointModel.disable();
  tripPresenter.createPoint(() => newPointModel.enable());
};

const btnNewPointPresenter = new BtnNewPointPresenter(headerInnerNode, handleBtnNewPointClick, newPointModel, offersModel, descriptionsModel);

tripPresenter.init();
filterPresenter.init();
summaryPresenter.init();

apiWithProvider.getOffers()
  .then((offers) => {
    offersModel.setOffers(UpdateType.MAJOR, offers);
  })
  .catch(() => {
    offersModel.setOffers(UpdateType.MAJOR, []);
  });

apiWithProvider.getDestinations()
  .then((destinations) => {
    descriptionsModel.setDestinations(UpdateType.MAJOR, destinations);
  })
  .catch(() => {
    descriptionsModel.setDestinations(UpdateType.MAJOR, []);
  });

apiWithProvider.getPoints()
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

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
