import {
  getRandomInteger,
  getRandomElement,
  getRandomSubArray
} from './utils.js';
import {
  POINT_TYPES
} from '../const.js';
import {
  EVENT_SITIES,
  DESCRIPTION,
  POINT_OFFERS
} from './data.js';
import dayjs from 'dayjs';

const MAX_DAYS_GAP = 7;
const MAX_HOURS_GAP = 4;

const generateOffers = (type) => {
  const offers = POINT_OFFERS.find((item) => item.type === type)['offers'];

  return getRandomSubArray(offers);
};
const generateDescription = () => {
  const sentences = DESCRIPTION.split('. ');

  return sentences.splice(1, getRandomInteger(1, 6));
};
const generatePhotos = () => {
  const numberPhotos = getRandomInteger(1, 5);
  const sentences = DESCRIPTION.split('. ');

  return new Array(numberPhotos).fill().map(() => ({
    'src': `http://picsum.photos/248/152?r=${Math.random()}`,
    'description': getRandomElement(sentences),
  }));
};
const generateDateFrom = () => {
  const daysGap = getRandomInteger(1, MAX_DAYS_GAP);

  return dayjs()
    .hour(getRandomInteger(0, 12))
    .minute(getRandomInteger(0, 5) * 10)
    .add(daysGap, 'days')
    .format('YYYY-MM-DDTHH:mm:ss.msZ');
};
const generateDateTo = (dateFrom) => {
  const hoursGap = getRandomInteger(1, MAX_HOURS_GAP);

  return dayjs(dateFrom)
    .minute(getRandomInteger(0, 5) * 10)
    .add(hoursGap, 'hour')
    .format('YYYY-MM-DDTHH:mm:ss.msZ');
};

export const generateEventData = () => {
  const type = getRandomElement(POINT_TYPES);
  const offers = generateOffers(type);

  const dateFrom = generateDateFrom();
  const dateTo = generateDateTo(dateFrom);

  return {
    id: String(getRandomInteger(0, 1000000)),
    type,
    offers,
    destination: {
      description: generateDescription(),
      name: getRandomElement(EVENT_SITIES),
      pictures: generatePhotos(),
    },
    price: getRandomInteger(1, 20) * 10,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    dateFrom,
    dateTo,
  };
};
