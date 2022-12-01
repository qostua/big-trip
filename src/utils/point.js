import {getDatesDifferencePerMs} from './common.js';

export const updatePoint = (array, newPoint) => {
  const index = array.findIndex((point) => point.id === newPoint.id);

  if (index === -1) {
    return array;
  }

  return [
    ...array.slice(0, index),
    newPoint,
    ...array.slice(index + 1),
  ];
};

export const compareDatePoints = (pointA, pointB) => getDatesDifferencePerMs(pointB.dateFrom, pointA.dateFrom);

export const compareTimePoints = (pointA, pointB) => getDatesDifferencePerMs(pointB.dateTo, pointB.dateFrom) - getDatesDifferencePerMs(pointA.dateTo, pointA.dateFrom);

export const comparePricePoints = (pointA, pointB) => pointA.price - pointB.price;
