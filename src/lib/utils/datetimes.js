import { addHours, setHours, setMinutes, setSeconds } from 'date-fns';
import * as locales from 'date-fns/locale';

import { UI } from '@solid/lit-vocab-common';

/**
 * @param value - object stored in the pod
 * @param type - one of UI[TimeField, DateField, DateTimeField]
 * @returns {Date} - local datetime for the given string
 */
export const parseInitialValue = (value: string, type: string): Date => {
  if (type === UI.TimeField.iriAsString) {
    if (!value) return '';
    const tokens = value.split(':');

    let date = new Date();
    date = setHours(date, tokens[0]);
    date = setMinutes(date, tokens[1]);
    date = setSeconds(date, tokens[2]);

    return date;
  }
  if (type === UI.DateField.iriAsString) {
    if (!value) return '';
    /* date constructor interprets `value` as a UTC time, instead of a local time.
      To convert that we apply the offset in hours.
     */
    let date = new Date(value);
    const offset = date.getTimezoneOffset();

    date = addHours(date, offset / 60);
    return date;
  }
  if (type === UI.DateTimeField.iriAsString) {
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

/**
 * gets and transform the browser locale to match the date-fns locale name
 * e.g.: browser format: `en-US`
 *       date-fns format: `enUS`
 *
 * @returns string the matching locale name, if found, enUS otherwise
 */
export const getFormattedLocale = (): string => {
  const locale = getLocale().split('-');
  if (locale.length > 1) {
    locale[1] = locale[1].toUpperCase();
    return `${locale[0]}${locale[1]}`;
  }
  return `${locale[0]}`;
};

/**
 * tries to get the closest locale object based on the browser locale
 * e.g.: `en-US` -> locales[`enUS`]
 *       `es-CR` -> locales[`es`]
 * @returns {Locale | enUS} the closest found locale object
 */
export const getClosestLocale = (): string => {
  const firstOption = locales[getFormattedLocale()];
  if (firstOption) return firstOption;

  const browserLocale = getLocale();
  const secondOption = locales[browserLocale.split('-')[0]];
  if (secondOption) return secondOption;

  return locales.enUS;
};
