import React from 'react';
import CheckBox from '../CheckBox/check-box.component';

type Props = {
  list: any[]
};

const CheckBoxList = ({ list }: Props) => {
  return (
    <div>
      {list.map(check => (
        <CheckBox {...check} />
      ))}
    </div>
  );
};

export default CheckBoxList;
