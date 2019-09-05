import React from 'react';

const InputTypes = {
  'http://www.w3.org/ns/ui#SingleLineTextField': 'text',
  'http://www.w3.org/ns/ui#EmailField': 'email',
  'http://www.w3.org/ns/ui#PhoneField': 'phone'
};

const Input = ({ id, value, retrieveNewFormObject, setFormObject, formObject, ...rest }) => {
  const type = rest['rdf:type'];
  const label = rest['ui:label'] || '';
  const maxLength = rest['ui:maxLength'] || 256;
  const size = rest['ui:size'] || 40;
  const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;
  const onChange = ({ target }) => {
    const obj = { value: target.value, ...rest };
    const formObject = retrieveNewFormObject(id, obj);
    console.log('Form Object', formObject);
    setFormObject(formObject);
  };

  return (
    <label htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type={InputTypes[type]}
        {...{ maxLength, size, value: actualValue || '', onChange }}
      />
    </label>
  );
};

export default Input;
