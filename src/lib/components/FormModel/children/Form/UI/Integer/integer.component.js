import React, { useState, useContext } from 'react';
import { UI } from '@constants';
import { ThemeContext } from '@context';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void
};

const Integer = (props: Props) => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const {
    [UI.LABEL]: label,
    [UI.MIN_VALUE]: minValue,
    [UI.SIZE]: size,
    [UI.VALUE]: initialValue
  } = data;

  const [value, setValue] = useState(initialValue);

  const onChange = event => {
    const re = /^[0-9]+$/;
    if (event.target.value === '' || re.test(event.target.value)) setValue(event.target.value);
  };

  const onBlur = () => updateData(id, value);

  return (
    <div className={theme && theme.integerField}>
      <label htmlFor={id}>{label}</label>
      <input
        {...{
          id,
          min: minValue,
          step: '1',
          size,
          value,
          onChange,
          onBlur
        }}
      />
    </div>
  );
};

export default Integer;
