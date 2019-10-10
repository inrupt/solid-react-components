import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
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
  ({ id, value, modifyFormObject, formObject, onSave, autoSave, ...rest }) => {
    const [selectedDate, setDate] = useState(null);
    const [invalidate, setInvalid] = useState(null);
    const { DateTimePicker, TimeField } = UITypes;
    const { UI_LABEL, RDF_TYPE, MIN_VALUE, MAX_VALUE } = FromModelUI;
    const minValue = +rest[MIN_VALUE];
    const maxValue = +rest[MAX_VALUE];
    const label = rest[UI_LABEL] || '';
    const type = rest[RDF_TYPE];
    const showTimeSelect = type === DateTimePicker || type === TimeField || false;
    const showTimeSelectOnly = type === TimeField || false;
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
                minDate: minValue,
                maxDate: maxValue,
                onChangeRaw: e => handleChangeRaw(e),
                className: theme && theme.inputText,
                onBlur: autoSave && onSave,
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
