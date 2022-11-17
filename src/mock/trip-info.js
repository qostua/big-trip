export const generateTripCitiesArray = (points) => {
  const cities = new Set();

  points.forEach((point) => cities.add(point.destination.name));
  return Array.from(cities);
};

export const getTotalCost = (points) => points.reduce((currentCost, point) => currentCost + point.price, 0);

export const getDateRange = (points) => points.map((point) => point.dateFrom);
