import {getDatesDifferencePerMs, getTodayDateString} from './time.js';

export const compareDatePoints = (pointA, pointB) => getDatesDifferencePerMs(pointB.dateFrom, pointA.dateFrom);
export const compareTimePoints = (pointA, pointB) => getDatesDifferencePerMs(pointA.dateTo, pointA.dateFrom) - getDatesDifferencePerMs(pointB.dateTo, pointB.dateFrom);
export const comparePricePoints = (pointA, pointB) => pointB.price - pointA.price;

export const isPointPast = (point) => getDatesDifferencePerMs(point.dateFrom, getTodayDateString()) > 0;
export const isPointFuture = (point) => getDatesDifferencePerMs(point.dateTo, getTodayDateString()) < 0;
