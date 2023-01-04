import dayjs from 'dayjs';

import {TimeFormats} from '../const.js';

export const getFormatedDateStringFromDate = (date, format = TimeFormats.DATA) => dayjs(date).format(format);

export const getDatesDifferencePerMs = (dateStringFrom, dateStringTo) => dayjs(dateStringTo).diff(dayjs(dateStringFrom));
export const msToHumanizeTime = (ms) => {
  const totalMinutes = Math.round(ms / 60000);

  if (totalMinutes === 0) {
    return '00M';
  }

  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;

  const daysString = (days !== 0) ? `${String(days).padStart(2, '0')}D` : '';
  const hoursString = (hours !== 0 || days !== 0) ? `${String(hours).padStart(2, '0')}H` : '';
  const minutesString = `${String(minutes).padStart(2, '0')}M`;

  return [daysString, hoursString, minutesString].join(' ');
};

export const getTodayDateString = () => getFormatedDateStringFromDate(dayjs());
export const getYear = (dateString) => dayjs(dateString).get('year');
export const getMonth = (dateString) => dayjs(dateString).get('month');
export const getDate = (dateString) => dayjs(dateString).get('date');
export const getHumanizeDateRange = (firstDate, lastDate) => {
  let firstTimeFormat, secondTimeFormat;

  if (getYear(firstDate) !== getYear(lastDate)) {
    firstTimeFormat = TimeFormats.HUM_DATE;
    secondTimeFormat = TimeFormats.HUM_DATE;
  } else if (getMonth(firstDate) !== getMonth(lastDate)) {
    firstTimeFormat = TimeFormats.DAY;
    secondTimeFormat = TimeFormats.DAY;
  } else if (getDate(firstDate) !== getDate(lastDate)) {
    firstTimeFormat = TimeFormats.DAY;
    secondTimeFormat = TimeFormats.ONLY_DAY;
  } else {
    return getFormatedDateStringFromDate(firstDate, TimeFormats.DAY);
  }

  return `${getFormatedDateStringFromDate(firstDate, firstTimeFormat)} - ${getFormatedDateStringFromDate(lastDate, secondTimeFormat)}`;
};
