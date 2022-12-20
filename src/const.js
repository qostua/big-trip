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

export const TimeFormats = {
  DATA: 'YYYY-MM-DDTHH:mm:ss.ms[Z]',
  HUMANIZE: 'DD/MM/YY HH:mm',
  DATE: 'YYYY-MM-DD',
  DAY: 'MMM D',
  TIME: 'HH:mm',
  ONLY_MONTH: 'M',
  ONLY_DAY: 'D',
};

const FilterMods = {
  DISABLED: false,
  ENABLE: true,
};

export const FilterTypes = {
  DAY: {
    name: 'day',
    mod: FilterMods.ENABLE,
  },
  EVENT: {
    name: 'event',
    mod: FilterMods.DISABLED,
  },
  TIME: {
    name: 'time',
    mod: FilterMods.ENABLE,
  },
  PRICE: {
    name: 'price',
    mod: FilterMods.ENABLE,
  },
  OFFERS: {
    name: 'offers',
    mod: FilterMods.DISABLED,
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
