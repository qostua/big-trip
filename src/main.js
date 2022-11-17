import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import SiteMenuView from './view/menu.js';
import TripFiltersView from './view/filters.js';
import TripSortView from './view/trip-sort.js';
import PointsListView from './view/points-list.js';
import EmptyListPlugView from './view/empty-list-plug.js';
import PointView from './view/point-item.js';
import PointEditingView from './view/point-item-editing.js';

import {generateEventData} from './mock/point-item.js';
import {POINT_OFFERS} from './mock/data.js';
import {generateDescriptionsData} from './mock/destination.js';
import {generateTripCitiesArray, getTotalCost, getDateRange} from './mock/trip-info.js';

import {render, RenderPosition, replace} from './utils/render.js';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill(null).map(() => generateEventData());
const tripCities = generateTripCitiesArray(events);
const tripCost = getTotalCost(events);
const tripDates = getDateRange(events);
const destinations = generateDescriptionsData();

const pageBodyNode = document.querySelector('.page-body');
const headerInnerNode = pageBodyNode.querySelector('.trip-main');
const menuWrapNode = headerInnerNode.querySelector('.trip-controls__navigation');
const filtersWrapNode = headerInnerNode.querySelector('.trip-controls__filters');
const pageMainNode = pageBodyNode.querySelector('.page-main');
const tripEventsNode = pageMainNode.querySelector('.trip-events');

if (events.length !== 0) {
  const tripInfoComponent = new TripInfoView(tripCities, tripDates);
  render(headerInnerNode, tripInfoComponent, RenderPosition.AFTERBEGIN);
  render(tripInfoComponent, new TripCostView(tripCost), RenderPosition.BEFOREEND);
}

render(menuWrapNode, new SiteMenuView(), RenderPosition.BEFOREEND);
render(filtersWrapNode, new TripFiltersView(), RenderPosition.BEFOREEND);

const pointsListComponent = new PointsListView();
render(tripEventsNode, new TripSortView(), RenderPosition.AFTERBEGIN);
render(tripEventsNode, pointsListComponent, RenderPosition.BEFOREEND);

const renderPoint = (listPoints, point) => {
  const pointComponent = new PointView(point);
  const pointEditingComponent = new PointEditingView(destinations, POINT_OFFERS, point);

  const replacePointToForm = () => {
    replace(pointEditingComponent, pointComponent);
  };
  const replaceFormToPoint = () => {
    replace(pointComponent, pointEditingComponent);
  };

  const onEscKeyDown = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.setRollupBtnClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });
  pointEditingComponent.setRollupBtnClickHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });
  pointEditingComponent.setFormSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointsListComponent, pointComponent, RenderPosition.BEFOREEND);
};

if (events.length === 0) {
  render(tripEventsNode, new EmptyListPlugView(), RenderPosition.BEFOREEND);
} else {
  for (let i = 1; i < EVENTS_COUNT; i++) {
    renderPoint(pointsListComponent, events[i]);
  }
}
