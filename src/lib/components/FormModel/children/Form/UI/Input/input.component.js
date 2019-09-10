import React from 'react';

const InputTypes = {
  'http://www.w3.org/ns/ui#SingleLineTextField': 'text',
  'http://www.w3.org/ns/ui#EmailField': 'email',
  'http://www.w3.org/ns/ui#PhoneField': 'phone'
};

const Input = ({ id, value, retrievenewformobject, setformobject, formobject, ...rest }) => {
  const type = rest['rdf:type'];
  const label = rest['ui:label'] || '';
  const maxLength = rest['ui:maxLength'] || 256;
  const size = rest['ui:size'] || 40;
  const actualValue = formobject[id] || formobject[id] === '' ? formobject[id].value : value;
  const onChange = ({ target }) => {
    const obj = { value: target.value, ...rest };
    const formObject = retrievenewformobject(id, obj);

    setformobject(formObject);
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
