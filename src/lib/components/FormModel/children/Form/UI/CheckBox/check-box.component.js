import React, { useContext, useState } from 'react';

import { FormModelConfig } from '@context';
import { FormModelUI } from '@constants';

const { UI_VALUE, UI_DEFAULT, UI_LABEL, UI_NAME } = FormModelUI;

type Props = {
  formObject: Object,
  id: String,
  autoSave: Boolean,
  onSave: () => void,
  modifyFormObject: (id: String, object: any) => void
};

const CheckBox = (props: Props) => {
  const {
    id,
    modifyFormObject,
    formObject,
    onSave,
    autoSave,
    [UI_VALUE]: podValue,
    [UI_DEFAULT]: podDefault,
    [UI_LABEL]: label,
    [UI_NAME]: name,
    ...rest
  } = props;

  const { theme } = useContext(FormModelConfig);

  let value;
  try {
    value = JSON.parse(podValue);
  } catch (e) {
    value = JSON.parse(podDefault);
  }

  const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;

  const onChange = async value => {
    const obj = { ...rest, value: !value, oldValue: value.toString() };
    modifyFormObject(id, obj);

    if (autoSave) {
      await onSave();
    }
  };

  return (
    <>
      <input
        {...{
          type: 'checkbox',
          name,
          id: name,
          onChange: () => onChange(actualValue),
          value: actualValue,
          checked: actualValue
        }}
      />
      <label {...{ htmlFor: name, className: theme.inputCheckbox }}>{label}</label>
    </>
  );
};

export default CheckBox;
