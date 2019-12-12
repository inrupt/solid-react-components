import React, { useEffect, useState } from 'react';
import { FormModelConfig } from '@context';
import { FormModelUI } from '@constants';

type Props = {
  formObject: any,
  id: String,
  autoSave: Boolean,
  onSave: () => void,
  modifyFormObject: (id: String, object: any) => void
};

const { UI_VALUE, UI_DEFAULT, UI_LABEL, UI_NAME } = FormModelUI;

const CheckBox = ({
  id,
  modifyFormObject,
  formObject,
  onSave: save,
  autoSave,
  value,
  ...rest
}: Props) => {
  let podValue;
  try {
    podValue = JSON.parse(formObject[id] || formObject[id] === '' ? formObject[id].value : value);
  } catch (e) {
    podValue = false;
  }

  const [checked, setChecked] = useState(podValue);

  const label = rest[UI_LABEL];
  const name = rest[UI_NAME];

  const onChange = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    const obj = { ...rest, value: checked.toString() };
    modifyFormObject(id, obj);
  }, [checked]);

  useEffect(() => {
    if (autoSave) save();
  }, [formObject]);

  return (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <div className="input-wrap">
          <label htmlFor={name} className={theme && theme.inputCheckbox}>
            <input
              {...{
                type: 'checkbox',
                name,
                id: name,
                onChange,
                checked
              }}
            />
            {label || 'Label'}
          </label>
        </div>
      )}
    </FormModelConfig.Consumer>
  );
};

export default CheckBox;
