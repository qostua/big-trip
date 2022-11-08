const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
const getRandomElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};
const getRandomSubArray = (array) => {
  const subArray = [];

  const isEmpty = () => Boolean(getRandomInteger(0, 1));
  if (isEmpty()) {
    return subArray;
  }

  const isInclude = () => Boolean(getRandomInteger(0, 1));
  array.forEach((item) => {
    if (isInclude()) {
      subArray.push(item);
    }
  });

  return subArray;
};

export {
  getRandomInteger,
  getRandomElement,
  getRandomSubArray
};
