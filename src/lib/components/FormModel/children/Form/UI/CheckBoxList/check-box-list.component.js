import React from 'react';
import CheckBox from '../CheckBox/check-box.component';

const CheckBoxList = ({ list }) => {
  return (
    <div>
      {list.map(check => (
        <CheckBox {...check} />
      ))}
    </div>
  );
};

export default CheckBoxList;
