import FilterView from '../view/filter.js';

import {render, replace, remove, RenderPosition} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._isDisabled = false;

    this._filterComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevFilterComponent = this._filterComponent;

    const filters = this._getFilters();
    const currentFilter = this._filterModel.getFilter();

    this._filterComponent = new FilterView(filters, currentFilter, this._isDisabled);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  disableFilters() {
    this._isDisabled = true;
    this.init();
  }

  enableFilters() {
    this._isDisabled = false;
    this.init();
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();

    return [
      {
        type: FilterType.EVERYTHING,
        isEmpty: false,
      },
      {
        type: FilterType.PAST,
        isEmpty: filter[FilterType.PAST](points).length === 0,
      },
      {
        type: FilterType.FUTURE,
        isEmpty: filter[FilterType.FUTURE](points).length === 0,
      },
    ];
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelEvent() {
    this.init();
  }
}
