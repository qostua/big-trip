import {POINT_TYPES} from '../const.js';
import {getDatesDifferencePerMs} from './common.js';

const getTypesMap = () => {
  const typePrices = new Map();
  POINT_TYPES.forEach((type) => typePrices.set(type, 0));

  return typePrices;
};

const getSortedArrayFromMap = (map) => {
  const array = Array.from(map, ([name, value]) => ({ name, value }));

  return array.sort((typeA, typeB) => typeB.value - typeA.value);
};

export const getSortedTypes = (points, sortParameter) => {
  const typePrices = getTypesMap();

  points.forEach((point) => {
    const prevValue = typePrices.get(point.type);
    typePrices.set(point.type, prevValue + point[sortParameter]);
  });

  return getSortedArrayFromMap(typePrices);
};

export const getSortedByCountTypes = (points) => {
  const typeCounts = getTypesMap();

  points.forEach((point) => {
    const prevValue = typeCounts.get(point.type);
    typeCounts.set(point.type, prevValue + 1);
  });

  return getSortedArrayFromMap(typeCounts);
};

export const getSortedByTimeTypes = (points) => {
  const typeTimes = getTypesMap();

  points.forEach((point) => {
    const prevValue = typeTimes.get(point.type);
    typeTimes.set(point.type, prevValue + getDatesDifferencePerMs(point.dateFrom, point.dateTo));
  });

  return getSortedArrayFromMap(typeTimes);
};

export const getTypeNames = (types) => types.map((type) => type.name.toUpperCase());

export const getTypeValues = (types) => types.map((type) => type.value);
