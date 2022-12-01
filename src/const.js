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
