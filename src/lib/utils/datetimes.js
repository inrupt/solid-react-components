import { addHours, setHours, setMinutes, setSeconds } from 'date-fns';
import { UITypes } from '@constants';

/**
 * @param value - object stored in the pod
 * @param type - one of UITypes[TimeField, DateField, DateTimeField]
 * @returns {Date} - local datetime for the given string
 */
export const parseInitialValue = (value: string, type: string): Date => {
  if (type === UITypes.TimeField) {
    const tokens = value.split(':');

    let date = new Date();
    date = setHours(date, tokens[0]);
    date = setMinutes(date, tokens[1]);
    date = setSeconds(date, tokens[2]);

    return date;
  }
  if (type === UITypes.DateField) {
    /* date constructor interprets `value` as a UTC time, instead of a local time.
      To convert that we apply the offset in hours.
     */
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    return addHours(date, offset / 60);
  }
  if (type === UITypes.DateTimeField) return new Date(value);
};

/**
 * @returns {string} - the browser-set locale
 */
export const getLocale = (): string => {
  if (navigator.languages !== undefined) return navigator.languages[0];
  return navigator.language ? navigator.language : 'en-US';
};
