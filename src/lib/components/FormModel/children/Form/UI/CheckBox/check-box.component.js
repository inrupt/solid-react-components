import React, { useEffect, useState, useContext } from 'react';
import { UI } from '@solid/lit-vocab-common';
import { ThemeContext } from '@context';
import { InputGroup } from '../Input/input.styles';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void
};

export const CheckBox = (props: Props) => {
  const { id, data, updateData } = props;
  const { theme } = useContext(ThemeContext);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const podValue = data[UI.value];
      if (!podValue || podValue === 'false') {
        setChecked(false);
      } else {
        setChecked(true);
      }
    } catch (e) {
      setChecked(false);
    }
  }, [data[UI.value]]);

  const { [UI.label]: label } = data;

  const onChange = event => {
    const updatedPart = { ...data, value: String(event.target.checked) };
    updateData(id, updatedPart);
    setChecked(event.target.checked);
  };

  return (
    <InputGroup className={theme && theme.checkboxField}>
      <label htmlFor={id} className={theme.inputLabel}>
        {label}
      </label>
      <input
        className={theme && theme.inputCheckbox}
        type="checkbox"
        {...{
          id,
          onChange,
          checked
        }}
      />
    </InputGroup>
  );
};
