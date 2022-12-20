import {getDatesDifferencePerMs} from './common.js';

export const compareDatePoints = (pointA, pointB) => getDatesDifferencePerMs(pointB.dateFrom, pointA.dateFrom);

export const compareTimePoints = (pointA, pointB) => getDatesDifferencePerMs(pointB.dateTo, pointB.dateFrom) - getDatesDifferencePerMs(pointA.dateTo, pointA.dateFrom);

export const comparePricePoints = (pointA, pointB) => pointA.price - pointB.price;
