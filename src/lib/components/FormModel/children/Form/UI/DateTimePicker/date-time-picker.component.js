import React, { useState, useEffect, useCallback } from 'react';
import { addDays, addSeconds, setHours, setMinutes, format } from 'date-fns';
import * as locales from 'date-fns/locale';

import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ErrorMessage } from './date-time.styles';

import { FormModelConfig } from '@context';
import { UITypes, FormModelUI, DATE_FORMAT } from '@constants';
import { parseInitialValue, isValidDate, getClosestLocale } from '@utils';

const DateTimePicker = React.memo(
  ({ id, value, modifyFormObject, formObject, onSave, autoSave, onBlur, ...rest }) => {
    const [selectedDate, setDate] = useState(null);
    const [invalidate, setInvalid] = useState(null);

    const {
      UI_LABEL,
      RDF_TYPE,
      MIN_VALUE,
      MAX_VALUE,
      MIN_DATE_OFFSET,
      MAX_DATE_OFFSET,
      MIN_DATETIME_OFFSET,
      MAX_DATETIME_OFFSET
    } = FormModelUI;

    const minValue = rest[MIN_VALUE];
    const maxValue = rest[MAX_VALUE];
    const mindateOffset = parseInt(rest[MIN_DATE_OFFSET], 10);
    const maxdateOffset = parseInt(rest[MAX_DATE_OFFSET], 10);
    const mindatetimeOffset = parseInt(rest[MIN_DATETIME_OFFSET], 10);
    const maxdatetimeOffset = parseInt(rest[MAX_DATETIME_OFFSET], 10);
    const label = rest[UI_LABEL] || '';
    const type = rest[RDF_TYPE];

    useEffect(() => {
      /* if there is an updated value on the server, use that otherwise use the prop */
      let actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;
      actualValue = parseInitialValue(actualValue, type);

      setDate(actualValue);
    }, [formObject]);

    const onChange = useCallback(date => {
      let obj = {};

      /* User wants to remove the date */
      if (!date) {
        obj = { value: '', ...rest };
        setDate(null);
        return;
      }

      /* assign the format to save based on the type */
      if (type === UITypes.TimeField) obj.value = format(date, DATE_FORMAT.TIME);
      if (type === UITypes.DateField) obj.value = format(date, DATE_FORMAT.DATE);
      if (type === UITypes.DateTimeField) obj.value = date.toISOString();

      obj = { ...obj, ...rest };
      modifyFormObject(id, obj);
      setDate(date);
    });

    /* set the date ranges based on the UI Element to display */
    let minDate;
    let maxDate;
    let minTime;
    let maxTime;
    let dateOptions;

    /* Transform the incoming values depending on the type of element to display */
    if (type === UITypes.TimeField) {
      /* min, max Values are times */
      let minHours;
      let minMinutes;
      let maxHours;
      let maxMinutes;

      const timeFormat = /ˆ\d{1,2}:\d{2}$/;

      /* we make the assumption that min,maxValue are in the HH:mm format */
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

    if (type === UITypes.DateTimeField) {
      /* min, max Values are datetimes and offset is in seconds */
      if (!Number.isNaN(mindatetimeOffset)) minDate = addSeconds(new Date(), mindatetimeOffset);
      if (!Number.isNaN(maxdatetimeOffset)) maxDate = addSeconds(new Date(), maxdatetimeOffset);

      /* min,maxValue take priority over the offsets if both values are provided */
      if (minValue) minDate = new Date(minValue);
      if (maxValue) maxDate = new Date(maxValue);

      dateOptions = { minDate, maxDate, dateFormat: 'Pp', showTimeSelect: true };
    }

    if (type === UITypes.DateField) {
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
      <FormModelConfig.Consumer>
        {({ theme }) => (
          <div>
            <label htmlFor={id}>{label}</label>
            <DatePicker
              {...{
                id,
                ...dateOptions,
                selected: isValidDate(selectedDate) ? selectedDate : null,
                onChange,
                className: theme && theme.inputText,
                onBlur,
                locale: locale.code
              }}
            />
            {invalidate && <ErrorMessage>{invalidate}</ErrorMessage>}
          </div>
        )}
      </FormModelConfig.Consumer>
    );
  }
);

export default DateTimePicker;
