import {isPointFuture, isPointPast} from './point.js';
import {FilterType} from '../const.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter(isPointPast),
  [FilterType.FUTURE]: (points) => points.filter(isPointFuture),
};
