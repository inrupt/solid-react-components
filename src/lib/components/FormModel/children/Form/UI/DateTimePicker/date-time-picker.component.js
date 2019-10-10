import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { FormModelConfig } from '@context';

import 'react-datepicker/dist/react-datepicker.css';

import { ErrorMessage } from './date-time.styles';

const getDateType = type => {
  return type.includes('#') ? type.split('#').pop() : 'default';
};

const DateTimePicker = React.memo(
  ({ id, value, modifyFormObject, formObject, onSave, autoSave, ...rest }) => {
    const [selectedDate, setDate] = useState(null);
    const [invalidate, setInvalid] = useState(null);
    const minValue = +rest['ui:minValue'];
    const maxValue = +rest['ui:maxValue'];
    const label = rest['ui:label'] || '';
    const type = rest['rdf:type'];
    const fieldType = getDateType(type);
    const showTimeSelect = fieldType === 'DateTimeField' || fieldType === 'TimeField' || false;
    const showTimeSelectOnly = fieldType === 'TimeField' || false;

    const updateDate = () => {
      const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;

      if (actualValue) {
        setDate(new Date(actualValue));
      }
    };

    const onChange = date => {
      const obj = { value: date.toString(), ...rest };

      modifyFormObject(id, obj);
      setDate(date);
    };

    const handleChangeRaw = date => {
      const s = document.getElementById(id);
      s.value = moment(date.target.value).format('DD/MM/YYYY');

      setInvalid(s.value);
    };

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
                showTimeSelectOnly
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
