import { addHours, setHours, setMinutes, setSeconds } from 'date-fns';
import { UITypes } from '@constants';

/**
 * @param value - object stored in the pod
 * @param type - one of UITypes[TimeField, DateField, DateTimeField]
 * @returns {Date} - local datetime for the given string
 */
export const parseInitialValue = (value: string, type: string): Date => {
  if (type === UITypes.TimeField) {
    if (!value) return '';
    const tokens = value.split(':');

    let date = new Date();
    date = setHours(date, tokens[0]);
    date = setMinutes(date, tokens[1]);
    date = setSeconds(date, tokens[2]);

    return date;
  }
  if (type === UITypes.DateField) {
    if (!value) return '';
    /* date constructor interprets `value` as a UTC time, instead of a local time.
      To convert that we apply the offset in hours.
     */
    let date = new Date(value);
    const offset = date.getTimezoneOffset();

    date = addHours(date, offset / 60);
    return date;
  }
  if (type === UITypes.DateTimeField) {
    return new Date(value);
  }

  throw new Error(`Error: Unsupported type: ${type}`);
};

/**
 * @param value: value to check
 * @returns {boolean} true if @value is a Date object and not "Invalid date"
 */
export const isValidDate = (value: any): boolean => {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    // see https://stackoverflow.com/a/1353711
    return !Number.isNaN(value.getTime());
  }
  // Not a date
  return false;
};

/**
 * @returns {string} - the browser-set locale
 */
export const getLocale = (): string => {
  if (navigator.languages !== undefined) return navigator.languages[0];
  return navigator.language ? navigator.language : 'en-US';
};
