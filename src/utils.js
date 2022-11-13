import dayjs from 'dayjs';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getDayFromDateString = (dateString) => dayjs(dateString).format('MMM D');
export const getTimeFromDateString = (dateString) => dayjs(dateString).format('HH:mm');
export const getDateFromDateString = (dateString) => dayjs(dateString).format('DD/MM/YY HH:ss');
export const getDatesDifferencePerMs = (dateStringFrom, dateStringTo) => dayjs(dateStringTo).diff(dayjs(dateStringFrom));
export const msToHumanizeTime = (ms) => {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hoursString = (hours !== 0) ? `${hours}H` : '';
  const minutesString = (minutes !== 0) ? `${minutes}M` : '';

  return [hoursString, minutesString].join(' ');
};
