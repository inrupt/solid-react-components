import React from 'react';

const TextArea = ({ id, modifyFormObject, formObject, ...rest }) => {
  const name = '';
  const value = formObject[id] ? formObject[id].value : '';
  const onChange = ({ target }) => {
    const obj = { value: target.value, ...rest };
    modifyFormObject(id, obj);
  };
  return (
    <label htmlFor={name}>
      <textarea id={name} value={value} onChange={onChange} />
    </label>
  );
};

export default TextArea;
