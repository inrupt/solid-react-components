import React, { useState } from 'react';
import { InputTextTypes } from '@constants';
import { FormModelConfig } from '@context';

import { InputGroup } from './integer.styles';

const Integer = ({
  id,
  value,
  modifyFormObject,
  formObject,
  onSave,
  autoSave,
  onBlur,
  ...rest
}) => {
  const type = rest['rdf:type'];
  const label = rest['ui:label'] || '';
  const maxLength = rest['ui:maxLength'] || 256;
  const minValue = rest['ui:ui:minValue'] || 0;
  const size = rest['ui:size'] || 40;
  const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;
  const onChange = ({ target }) => {
    const re = /^[0-9]+$/;
    if (target.value === '' || re.test(target.value)) {
      const obj = { value: target.value, ...rest };
      modifyFormObject(id, obj);
    }
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
            min={minValue}
            step="1"
            {...{ maxLength, size, value: actualValue || '', onChange, onBlur }}
          />
        </InputGroup>
      )}
    </FormModelConfig.Consumer>
  );
};

export default Integer;
