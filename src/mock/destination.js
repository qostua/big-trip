import {
  getRandomInteger
} from './utils.js';
import {
  EVENT_SITIES,
  DESCRIPTION
} from './data.js';

const generateDescription = () => {
  const sentences = DESCRIPTION.split('. ');

  return sentences.splice(1, getRandomInteger(1, 6)).join(' ');
};

const generatePicture = () => ({
  'src': `https://picsum.photos/300/200?r=${Math.random()}`,
  'description': generateDescription(),
});

const generateDestinationData = (city) => ({
  'description': generateDescription(),
  'name': city,
  'pictures': new Array(getRandomInteger(0, 3)).fill(null).map(() => generatePicture()),
});

const generateDescriptionsData = () => EVENT_SITIES.map((city) => generateDestinationData(city));

export const EVENT_SITY_DESCRIPTIONS = generateDescriptionsData();
