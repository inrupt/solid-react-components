import React, { useContext } from 'react';

import { FormModelUI, InputTextTypes } from '@constants';
import { FormModelConfig } from '@context';

const { RDF_TYPE, UI_LABEL, MAX_LENGTH, MIN_VALUE, SIZE, UI_DEFAULT } = FormModelUI;

type Props = {
  id: string,
  value: string,
  modifyFormObject: (string, object) => void,
  formObject: Object,
  onSave: Function,
  autoSave: any,
  onBlur: Function,

  [RDF_TYPE]: string,
  [UI_DEFAULT]: string,
  [UI_LABEL]: string,
  [MAX_LENGTH]: string,
  [MIN_VALUE]: string,
  [SIZE]: string
};

const Decimal = (props: Props) => {
  const { theme } = useContext(FormModelConfig);

  const {
    [RDF_TYPE]: type,
    [UI_DEFAULT]: podDefault,
    [UI_LABEL]: podLabel,
    [MAX_LENGTH]: podMaxLength,
    [MIN_VALUE]: podMinValue,
    [SIZE]: podSize
  } = props;

  const { id, modifyFormObject, formObject, value, onBlur, ...rest } = props;

  const label = podLabel || podDefault;
  const maxLength = podMaxLength || 256;
  const minValue = podMinValue || 0;
  const size = podSize || 40;

  const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;

  const onChange = ({ target }) => {
    const obj = { value: target.value, ...rest };
    modifyFormObject(id, obj);
  };

  return (
    <div {...{ className: theme.inputText }}>
      <label {...{ htmlFor: id }}>{label}</label>
      <input
        {...{
          id,
          name: id,
          type: InputTextTypes[type],
          min: minValue,
          maxLength,
          size,
          value: actualValue,
          onChange,
          onBlur
        }}
      />
    </div>
  );
};

export default Decimal;
