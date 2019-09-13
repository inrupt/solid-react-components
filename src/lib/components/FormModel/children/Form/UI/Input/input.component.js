import React from 'react';
import styled from 'styled-components';
import { InputTextTypes } from '@constants';

const Label = styled.label`
  box-sizing: border-box;
  padding: 0.5em 1em;
  display: flex;
  align-items: center;
  & input {
    border-radius: 2px;
    border: solid 1px #ccc;
    padding: 0.5em;
    margin-left: 1em;
  }
`;

const Input = ({ id, value, modifyFormObject, formObject, onSave, autoSave, ...rest }) => {
  const type = rest['rdf:type'];
  const label = rest['ui:label'] || '';
  const maxLength = rest['ui:maxLength'] || 256;
  const size = rest['ui:size'] || 40;
  // console.log(formObject, value, 'into input')
  const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;
  const onChange = ({ target }) => {
    const obj = { value: target.value, ...rest };
    modifyFormObject(id, obj);
  };

  return (
    <Label htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type={InputTextTypes[type]}
        onBlur={autoSave && onSave}
        {...{ maxLength, size, value: actualValue || '', onChange }}
      />
    </Label>
  );
};

export default Input;
