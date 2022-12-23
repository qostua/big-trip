import {
  getRandomInteger,
  getRandomElement,
  getRandomSubArray
} from './utils.js';
import {
  POINT_TYPES, TimeFormats
} from '../const.js';
import {
  EVENT_SITIES,
  POINT_OFFERS_DATA
} from './data.js';
import dayjs from 'dayjs';
import {EVENT_SITY_DESCRIPTIONS} from './destination.js';

const MAX_DAYS_GAP = 3;
const MAX_HOURS_GAP = 4;

const generateOffers = (type) => {
  const offers = POINT_OFFERS_DATA.find((item) => item.type === type)['offers'];

  return getRandomSubArray(offers);
};
const generateDateFrom = () => {
  const daysGap = getRandomInteger(-MAX_DAYS_GAP, MAX_DAYS_GAP);

  return dayjs()
    .hour(getRandomInteger(0, 12))
    .minute(getRandomInteger(0, 5) * 10)
    .add(daysGap, 'days')
    .format(TimeFormats.DATA);
};
const generateDateTo = (dateFrom) => {
  const hoursGap = getRandomInteger(1, MAX_HOURS_GAP);

  return dayjs(dateFrom)
    .minute(getRandomInteger(0, 5) * 10)
    .add(hoursGap, 'hour')
    .format(TimeFormats.DATA);
};

export const generateEventData = () => {
  const type = getRandomElement(POINT_TYPES);
  const offers = generateOffers(type);

  const name = getRandomElement(EVENT_SITIES);

  const dateFrom = generateDateFrom();
  const dateTo = generateDateTo(dateFrom);

  return {
    id: String(getRandomInteger(0, 1000000)),
    type,
    offers,
    destination: EVENT_SITY_DESCRIPTIONS.find((description) => description.name === name),
    price: getRandomInteger(1, 20) * 10,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    dateFrom,
    dateTo,
  };
};
