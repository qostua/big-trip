export const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  FUTURE: 'future',
};

export const TimeFormats = {
  DATA: 'YYYY-MM-DDTHH:mm:ss.ms[Z]',
  HUMANIZE: 'DD/MM/YY HH:mm',
  DATE: 'YYYY-MM-DD',
  DAY: 'MMM D',
  TIME: 'HH:mm',
  ONLY_MONTH: 'M',
  ONLY_DAY: 'D',
};

export const MenuItem = {
  TRIP: 'table',
  STATS: 'stats',
};

const FilterMod = {
  DISABLED: false,
  ENABLE: true,
};

export const SortType = {
  DAY: {
    name: 'day',
    mod: FilterMod.ENABLE,
  },
  EVENT: {
    name: 'event',
    mod: FilterMod.DISABLED,
  },
  TIME: {
    name: 'time',
    mod: FilterMod.ENABLE,
  },
  PRICE: {
    name: 'price',
    mod: FilterMod.ENABLE,
  },
  OFFERS: {
    name: 'offers',
    mod: FilterMod.DISABLED,
  },
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
