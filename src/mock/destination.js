import {
  getRandomInteger
} from './utils.js';
import {
  EVENT_SITIES,
  DESCRIPTION
} from './data.js';

const generateDescription = () => {
  const sentences = DESCRIPTION.split('. ');

  return sentences.splice(1, getRandomInteger(1, 6));
};

const generateDestinationData = (city) => ({
  'description': generateDescription(),
  'name': city,
  'pictures': [
    {
      'src': `http://picsum.photos/300/200?r=${Math.random()}`,
      'description': generateDescription(),
    },
  ],
});

export const generateDescriptionsData = () => EVENT_SITIES.map((city) => generateDestinationData(city));
