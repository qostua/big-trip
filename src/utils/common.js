import dayjs from 'dayjs';

export const getFormatedDateFromDateString = (dateString, format) => dayjs(dateString).format(format);
export const getDatesDifferencePerMs = (dateStringFrom, dateStringTo) => dayjs(dateStringTo).diff(dayjs(dateStringFrom));
export const msToHumanizeTime = (ms) => {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hoursString = (hours !== 0) ? `${hours}H` : '';
  const minutesString = (minutes !== 0) ? `${minutes}M` : '';

  return [hoursString, minutesString].join(' ');
};
