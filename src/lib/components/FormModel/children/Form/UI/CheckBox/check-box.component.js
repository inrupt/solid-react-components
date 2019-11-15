import React from 'react';
import { FormModelConfig } from '@context';
import { FormModelUI } from '@constants';

type Props = {
  formObject: any,
  id: String,
  autoSave: Boolean,
  onSave: () => void,
  modifyFormObject: (id: String, object: any) => void
};

const CheckBox = ({ id, modifyFormObject, formObject, onSave, autoSave, ...rest }: Props) => {
  const { UI_VALUE, UI_DEFAULT, UI_LABEL, UI_NAME } = FormModelUI;
  const valueFromPod = rest[UI_VALUE] ? JSON.parse(rest[UI_VALUE]) : Number(rest[UI_DEFAULT]);
  const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : valueFromPod;
  const label = rest[UI_LABEL] || '';
  const name = rest[UI_NAME] || 'radio';

  const onChange = async value => {
    const obj = { ...rest, value: !value, oldValue: value.toString() };
    modifyFormObject(id, obj);

    if (autoSave) {
      await onSave();
    }
  };

  return (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <div className="input-wrap">
          <label htmlFor={name} className={theme && theme.inputCheckbox}>
            <input
              type="checkbox"
              name={name}
              id={name}
              onChange={() => onChange(actualValue)}
              value={actualValue}
              checked={actualValue}
            />
            {label || 'Label'}
          </label>
        </div>
      )}
    </FormModelConfig.Consumer>
  );
};

export default CheckBox;
