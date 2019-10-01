import React from 'react';
import { FormModelConfig } from '@context';

import { Label } from './check-box.styles';

type Props = {
  formObject: any,
  id: String,
  autoSave: Boolean,
  onSave: () => void,
  modifyFormObject: (id: String, object: any) => void
};

const CheckBox = ({ id, modifyFormObject, formObject, onSave, autoSave, ...rest }: Props) => {
  const valueFromPod = rest['ui:value'] ? JSON.parse(rest['ui:value']) : Number(rest['ui:default']);
  const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : valueFromPod;
  const label = rest['ui:label'] || '';
  const name = rest['ui:name'] || 'radio';

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
        <Label
          htmlFor={name}
          onClick={() => onChange(actualValue)}
          className={theme && theme.inputCheckbox}
        >
          <input
            type="checkbox"
            name={name}
            onChange={() => {}}
            value={actualValue}
            checked={actualValue}
          />
          <span className="label-text">{label || 'Label'}</span>
        </Label>
      )}
    </FormModelConfig.Consumer>
  );
};

export default CheckBox;
