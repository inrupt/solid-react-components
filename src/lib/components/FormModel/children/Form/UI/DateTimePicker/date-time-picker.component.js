import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';

import moment from 'moment';
import { setHours, setMinutes, addDays, addSeconds, parse } from 'date-fns';

import { FormModelConfig } from '@context';
import { UITypes, FromModelUI } from '@constants';

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
    } = FromModelUI;

    const minValue = rest[MIN_VALUE];
    const maxValue = rest[MAX_VALUE];
    const mindateOffset = parseInt(rest[MIN_DATE_OFFSET], 10);
    const maxdateOffset = parseInt(rest[MAX_DATE_OFFSET], 10);
    const mindatetimeOffset = parseInt(rest[MIN_DATETIME_OFFSET], 10);
    const maxdatetimeOffset = parseInt(rest[MAX_DATETIME_OFFSET], 10);
    const label = rest[UI_LABEL] || '';
    const type = rest[RDF_TYPE];

    const showTimeSelect = type === UITypes.DateTimePicker || type === UITypes.TimeField || false;
    const showTimeSelectOnly = type === UITypes.TimeField || false;
    const dateFormat = getDateFormat(type);

    const updateDate = useCallback(() => {
      const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;

      if (actualValue) {
        setDate(new Date(actualValue));
      }
    }, [formObject]);

    const onChange = useCallback(date => {
      const obj = { value: date.toString(), ...rest };

      modifyFormObject(id, obj);
      setDate(date);
    });

    const handleChangeRaw = useCallback(
      date => {
        const s = document.getElementById(id);
        s.value = moment(date.target.value).format(dateFormat);

        setInvalid(s.value);
      },
      [value, formObject]
    );

    useEffect(() => {
      updateDate();
    }, [value, formObject]);

    /* set the date ranges based on the UI Element to display */
    let minDate;
    let maxDate;
    let minTime;
    let maxTime;

    /* Transform the incoming values depending on the type of element to display */
    if (type === UITypes.TimeField) {
      /* min, max Values are times */
      const [minHours, minMinutes] = minValue.split(':');
      const [maxHours, maxMinutes] = maxValue.split(':');

      minTime = setHours(setMinutes(new Date(), minMinutes), minHours);
      maxTime = setHours(setMinutes(new Date(), maxMinutes), maxHours);
    } else if (type === UITypes.DateTimePicker) {
      /* min, max Values are datetimes and offset is in seconds */
      minDate = parse(minValue) || addSeconds(new Date(), mindatetimeOffset);
      maxDate = parse(maxValue) || addSeconds(new Date(), maxdatetimeOffset);
    } else if (type === UITypes.DatePicker) {
      /* min, max values are dates and offset is in days */
      minDate = parse(minValue) || addDays(new Date(), mindateOffset);
      maxDate = parse(maxValue) || addDays(new Date(), maxdateOffset);
    }

    console.log(`type: ${type}`);
    console.log(`minDate: ${minDate}`);
    console.log(`maxDate: ${maxDate}`);
    console.log(`minTime: ${minTime}`);
    console.log(`maxTime: ${maxTime}`);

    return (
      <FormModelConfig.Consumer>
        {({ theme }) => (
          <div>
            <label htmlFor={id}>{label}</label>
            <DatePicker
              {...{
                id,
                selected: selectedDate,
                onChange,
                minDate,
                maxDate,
                minTime,
                maxTime,
                onChangeRaw: e => handleChangeRaw(e),
                className: theme && theme.inputText,
                onBlur,
                showTimeSelect,
                showTimeSelectOnly,
                dateFormat
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
