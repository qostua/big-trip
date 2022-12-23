import {FilterType, UpdateType} from '../const.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';

import FilterView from '../view/filter.js';

export default class Filter {
  constructor(filterContainer, filterModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;

    this._filterComponent = null;

    this._filtersTypes = FilterType;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return Object.values(this._filtersTypes);
  }
}
