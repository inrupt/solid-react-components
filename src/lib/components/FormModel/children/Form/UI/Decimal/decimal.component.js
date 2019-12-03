import React from 'react';
import { InputTextTypes } from '@constants';
import { FormModelConfig } from '@context';

import { InputGroup } from './decimal.styles';

const Decimal = ({
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
    if (target.value.length < 30) {
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
            type={InputTextTypes[type]}
            min={minValue}
            {...{ maxLength, size, value: actualValue || '', onChange, onBlur }}
          />
        </InputGroup>
      )}
    </FormModelConfig.Consumer>
  );
};

export default Decimal;
