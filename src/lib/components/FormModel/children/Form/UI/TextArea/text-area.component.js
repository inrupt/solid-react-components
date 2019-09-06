import React from 'react';

const TextArea = ({ fieldData }) => {
  const name = fieldData['ui:name'] || '';
  const value = fieldData['ui:value'] || '';
  return (
    <label htmlFor={name}>
      <textarea id={name}>{value}</textarea>
    </label>
  );
};

export default TextArea;
