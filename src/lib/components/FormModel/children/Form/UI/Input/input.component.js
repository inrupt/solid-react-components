import React from 'react';
import { InputTextTypes } from '@constants';
import { FormModelConfig } from '@context';

import { InputGroup } from './input.styles';

const Input = ({ id, value, modifyFormObject, formObject, onSave, autoSave, ...rest }) => {
  const type = rest['rdf:type'];
  const label = rest['ui:label'] || '';
  const maxLength = rest['ui:maxLength'] || 256;
  const size = rest['ui:size'] || 40;
  const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;
  const onChange = ({ target }) => {
    const obj = { value: target.value, ...rest };
    modifyFormObject(id, obj);
  };

  return (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <InputGroup className={theme && theme.inputText}>
          <label htmlFor={id} id={id}>
            {label}
          </label>
          <input
            id={id}
            name={id}
            type={InputTextTypes[type]}
            onBlur={autoSave && onSave}
            {...{ maxLength, size, value: actualValue || '', onChange }}
          />
        </InputGroup>
      )}
    </FormModelConfig.Consumer>
  );
};

export default Input;
