import React, { useState, useCallback, useContext, useEffect } from 'react';
import { addDays, addSeconds, setHours, setMinutes, format } from 'date-fns';
import * as locales from 'date-fns/locale';

import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { RDF, UI } from '@inrupt/lit-generated-vocab-common';
import { ThemeContext } from '@context';
import { DATE_FORMAT } from '@constants';

import { parseInitialValue, isValidDate, getClosestLocale } from '@utils';

export const DateTimePicker = props => {
  const { id, data, updateData } = props;

  const [selectedDate, setDate] = useState(null);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    setDate(parseInitialValue(data[UI.value.value], data[RDF.type.value]));
  }, [data[UI.value.value]]);

  // Fetch relevant values from the data prop, which represents the properties in the form model
  const minValue = data[UI.minValue.value];
  const maxValue = data[UI.maxValue.value];
  const mindateOffset = parseInt(data[UI.minDateOffset.value], 10);
  const maxdateOffset = parseInt(data[UI.maxDateOffset.value], 10);
  const mindatetimeOffset = parseInt(data[UI.minDatetimeOffset.value], 10);
  const maxdatetimeOffset = parseInt(data[UI.maxDatetimeOffset.value], 10);
  const label = data[UI.label.value] || '';
  const type = data[RDF.type.value];

  const onChange = date => {
    /* User wants to remove the date */
    if (!date) {
      const updatedPart = { ...data, value: '' };
      updateData(id, updatedPart);
      setDate(null);
      return;
    }

    let value;
    /* assign the format to save based on the type */
    if (type === UI.TimeField.value) value = format(date, DATE_FORMAT.TIME);
    if (type === UI.DateField.value) value = format(date, DATE_FORMAT.DATE);
    if (type === UI.DateTimeField.value) value = date.toISOString();

    const updatedPart = { ...data, value };
    updateData(id, updatedPart);
    setDate(date);
  };

  /* set the date ranges based on the UI Element to display */
  let minDate;
  let maxDate;
  let minTime;
  let maxTime;
  let dateOptions;

  /* Transform the incoming values depending on the type of element to display */
  if (type === UI.TimeField.value) {
    /* min, max Values are times */
    let minHours;
    let minMinutes;
    let maxHours;
    let maxMinutes;

    // Regex to match the format "##:##:##" or "#:##:##"
    const timeFormat = /^\d{1,2}:\d{2}:\d{2}$/;

    /* we make the assumption that min,maxValue are in the HH:mm:ss format */
    if (minValue && timeFormat.test(minValue)) {
      [minHours, minMinutes] = minValue.split(':');
      minTime = setHours(setMinutes(new Date(), minMinutes), minHours);
    } else {
      minTime = setHours(setMinutes(new Date(), 0), 0);
    }

    if (maxValue && timeFormat.test(maxValue)) {
      [maxHours, maxMinutes] = maxValue.split(':');
      maxTime = setHours(setMinutes(new Date(), maxMinutes), maxHours);
    } else {
      maxTime = setHours(setMinutes(new Date(), 59), 23);
    }

    dateOptions = {
      minTime,
      maxTime,
      dateFormat: 'p',
      showTimeSelect: true,
      showTimeSelectOnly: true
    };
  }

  if (type === UI.DateTimeField.value) {
    /* min, max Values are datetimes and offset is in seconds */
    if (!Number.isNaN(mindatetimeOffset)) minDate = addSeconds(new Date(), mindatetimeOffset);
    if (!Number.isNaN(maxdatetimeOffset)) maxDate = addSeconds(new Date(), maxdatetimeOffset);

    /* min,maxValue take priority over the offsets if both values are provided */
    if (minValue) minDate = new Date(minValue);
    if (maxValue) maxDate = new Date(maxValue);

    dateOptions = { minDate, maxDate, dateFormat: 'Pp', showTimeSelect: true };
  }

  if (type === UI.DateField.value) {
    /* min,maxValue are dates and offset is in days */
    if (!Number.isNaN(mindateOffset)) minDate = addDays(new Date(), mindateOffset);
    if (!Number.isNaN(maxdateOffset)) maxDate = addDays(new Date(), maxdateOffset);

    /* min,maxValue take priority over the offsets if both values are provided */
    if (minValue) minDate = new Date(minValue);
    if (maxValue) maxDate = new Date(maxValue);

    dateOptions = { minDate, maxDate, dateFormat: 'P' };
  }

  const locale = getClosestLocale();
  try {
    registerLocale(locale.code, locale);
  } catch (e) {
    registerLocale('en-US', locales.enUS);
  }

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <DatePicker
        {...{
          id,
          ...dateOptions,
          selected: isValidDate(selectedDate) ? selectedDate : null,
          onChange,
          className: theme && theme.inputText,
          locale: locale.code
        }}
      />
    </div>
  );
};
