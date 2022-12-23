import {getDatesDifferencePerMs, getTodayDateString} from './common.js';

export const compareDatePoints = (pointA, pointB) => getDatesDifferencePerMs(pointB.dateFrom, pointA.dateFrom);

export const compareTimePoints = (pointA, pointB) => getDatesDifferencePerMs(pointB.dateTo, pointB.dateFrom) - getDatesDifferencePerMs(pointA.dateTo, pointA.dateFrom);

export const comparePricePoints = (pointA, pointB) => pointA.price - pointB.price;

export const isPointPast = (point) => getDatesDifferencePerMs(point.dateFrom, getTodayDateString()) > 0;
export const isPointFuture = (point) => getDatesDifferencePerMs(point.dateTo, getTodayDateString()) < 0;
