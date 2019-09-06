import React from 'react';
import RadioButton from '../RadioButton';

const RadioButtonList = ({ list, name }) => {
  return (
    <div>
      {list.map(check => (
        <RadioButton {...{ ...check, name }} />
      ))}
    </div>
  );
};

export default RadioButtonList;
