import React, { useState } from 'react';

const InputText = ({ label, name, id }) => {
  const [value, setValue] = useState('');
  return (
    <div>
      <label htmlFor={name}>
        <input
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={({ target }) => setValue(target.value)}
        />
        {label}
      </label>
    </div>
  );
};

export default InputText;
