import dayjs from 'dayjs';

export const generateTripCitiesArray = (events) => {
  const cities = new Set();

  events.forEach((event) => cities.add(event.destination.name));
  return Array.from(cities);
};

export const getTotalCost = (events) => events.reduce((currentCost, event) => currentCost + event.price, 0);

export const getDateRange = (events) => {
  const eventSort = events
    .slice()
    .sort((eventA, eventB) => dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom)));

  const firstDate = dayjs(eventSort[0].dateFrom);
  const lastDate = dayjs(eventSort[eventSort.length - 1].dateFrom);
  return (firstDate.month() === lastDate.month())
    ? `${firstDate.format('MMM D')} - ${lastDate.format('D')}`
    : `${firstDate.format('MMM D')} - ${lastDate.format('MMM D')}`;
};
