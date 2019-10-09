import React from 'react';

type Props = {
  id: String,
  modifyFormObject: () => void,
  formObject: Object,
  rest: any
};

const TextArea = ({ id, modifyFormObject, formObject, ...rest }: Props) => {
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
