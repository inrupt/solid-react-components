import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';

import moment from 'moment';

import { FormModelConfig } from '@context';
import { UITypes, FormModelUI } from '@constants';

import 'react-datepicker/dist/react-datepicker.css';

import { ErrorMessage } from './date-time.styles';

const getDateFormat = type => {
  let format = '';

  switch (type) {
    case UITypes.DateTimePicker:
      format = 'MM/dd/yyyy hh:mm:ss';
      break;
    case UITypes.TimeField:
      format = 'hh:mm:ss';
      break;
    default:
      format = 'MM/dd/yyyy';
  }

  return format;
};

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

    const showTimeSelect = type === UITypes.DateTimeField || type === UITypes.TimeField || false;
    const showTimeSelectOnly = type === UITypes.TimeField || false;

    const updateDate = useCallback(() => {
      const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;

      if (actualValue) {
        setDate(new Date(actualValue));
      }
    }, [formObject]);

    const onChange = useCallback(date => {
      let obj = {};

      /* User wants to remove the date */
      if (!date) obj = { value: '', ...rest };
      else obj = { value: date.toString(), ...rest };

      modifyFormObject(id, obj);
      setDate(date);
    });

    useEffect(() => {
      updateDate();
    }, [value, formObject]);

    /* set the date ranges based on the UI Element to display */
    let minDate;
    let maxDate;
    let minTime;
    let maxTime;
    let dateOptions;

    /* Transform the incoming values depending on the type of element to display */
    if (type === UITypes.TimeField) {
      /* min, max Values are times */
      const [minHours, minMinutes] = minValue.split(':');
      const [maxHours, maxMinutes] = maxValue.split(':');

      minTime = moment()
        .hours(minHours)
        .minutes(minMinutes)
        .toDate();
      maxTime = moment()
        .hours(maxHours)
        .minutes(maxMinutes)
        .toDate();

      dateOptions = { minTime, maxTime, timeFormat: 'p', showTimeSelectOnly };
    }
    if (type === UITypes.DateTimeField) {
      /* min, max Values are datetimes and offset is in seconds */

      if (!Number.isNaN(mindatetimeOffset))
        minDate = moment(new Date())
          .add(mindatetimeOffset, 'seconds')
          .toDate();
      if (!Number.isNaN(maxdatetimeOffset))
        maxDate = moment(new Date())
          .add(maxdatetimeOffset, 'seconds')
          .toDate();

      /* min,maxValue take priority over the offsets if both values are provided */
      if (minValue) minDate = moment(minValue).toDate();
      if (maxValue) maxDate = moment(maxValue).toDate();

      dateOptions = { minDate, maxDate, timeFormat: 'p', showTimeSelect };
    }
    if (type === UITypes.DateField) {
      /* min,maxValue are dates and offset is in days */

      if (!Number.isNaN(mindateOffset))
        minDate = moment(new Date())
          .add(mindateOffset, 'days')
          .toDate();
      if (!Number.isNaN(maxdateOffset))
        maxDate = moment(new Date())
          .add(maxdateOffset, 'days')
          .toDate();

      /* min,maxValue take priority over the offsets if both values are provided */
      if (minValue) minDate = moment(minValue).toDate();
      if (maxValue) maxDate = moment(maxValue).toDate();

      dateOptions = { minDate, maxDate };
    }

    const getLang: string = () => {
      if (navigator.languages !== undefined) return navigator.languages[0];
      return navigator.language ? navigator.language : 'en-US';
    };

    return (
      <FormModelConfig.Consumer>
        {({ theme }) => (
          <div>
            <label htmlFor={id}>{label}</label>
            <DatePicker
              {...{
                id,
                ...dateOptions,
                selected: selectedDate,
                onChange,
                className: theme && theme.inputText,
                onBlur,
                locale: getLang()
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
