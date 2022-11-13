import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import SiteMenuView from './view/menu.js';
import TripFiltersView from './view/filters.js';
import TripSortView from './view/trip-sort.js';
import PointsListView from './view/points-list.js';
import EmptyListPlugView from './view/empty-list-plug.js';
import PointView from './view/point-item.js';
import PointEditingView from './view/form-editing.js';

import {generateEventData} from './mock/point-item.js';
import {POINT_OFFERS} from './mock/data.js';
import {generateDescriptionsData} from './mock/destination.js';
import {generateTripCitiesArray, getTotalCost, getDateRange} from './mock/trip-info.js';

import {render, RenderPosition} from './utils.js';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(() => generateEventData());
const tripCities = generateTripCitiesArray(events);
const tripCost = getTotalCost(events);
const tripDateRange = getDateRange(events);
const destinations = generateDescriptionsData();

const pageBodyNode = document.querySelector('.page-body');
const headerInnerNode = pageBodyNode.querySelector('.trip-main');
const menuWrapNode = headerInnerNode.querySelector('.trip-controls__navigation');
const filtersWrapNode = headerInnerNode.querySelector('.trip-controls__filters');
const pageMainNode = pageBodyNode.querySelector('.page-main');
const tripEventsNode = pageMainNode.querySelector('.trip-events');

const tripInfoComponent = new TripInfoView(tripCities, tripDateRange);

render(headerInnerNode, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
render(tripInfoComponent.getElement(), new TripCostView(tripCost).getElement(), RenderPosition.BEFOREEND);
render(menuWrapNode, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(filtersWrapNode, new TripFiltersView().getElement(), RenderPosition.BEFOREEND);

const pointsListComponent = new PointsListView();
render(tripEventsNode, new TripSortView().getElement(), RenderPosition.AFTERBEGIN);
render(tripEventsNode, pointsListComponent.getElement(), RenderPosition.BEFOREEND);

const renderPoint = (listPoints, point) => {
  const pointComponent = new PointView(point);
  const pointEditingComponent = new PointEditingView(destinations, POINT_OFFERS, point);

  const replacePointToForm = () => {
    listPoints.replaceChild(pointEditingComponent.getElement(), pointComponent.getElement());
  };
  const replaceFormToPoint = () => {
    listPoints.replaceChild(pointComponent.getElement(), pointEditingComponent.getElement());
  };

  const onEscKeyDown = (event, cb) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      cb();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', (event) => onEscKeyDown(event, replaceFormToPoint));
  });
  pointEditingComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToPoint();
  });
  pointEditingComponent.getElement().querySelector('.event--edit').addEventListener('submit', (event) => {
    event.preventDefault();
    replaceFormToPoint();
  });

  render(pointsListComponent.getElement(), pointComponent.getElement(), RenderPosition.BEFOREEND);
};

if (events.length === 0) {
  render(tripEventsNode, new EmptyListPlugView().getElement(), RenderPosition.BEFOREEND);
} else {
  for (let i = 1; i < EVENTS_COUNT; i++) {
    renderPoint(pointsListComponent.getElement(), events[i]);
  }
}
