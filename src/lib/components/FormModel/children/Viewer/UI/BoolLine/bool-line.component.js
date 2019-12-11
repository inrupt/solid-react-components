import React, { useContext } from 'react';

import { FormModelConfig } from '@context';
import { FormModelUI } from '@constants';

const { UI_NAME, UI_LABEL } = FormModelUI;

type Props = {
  value: string,
  [UI_NAME]: string,
  [UI_LABEL]: string
};

const BoolLine = (props: Props) => {
  const { theme } = useContext(FormModelConfig);
  const { value, [UI_NAME]: name, [UI_LABEL]: label } = props;

  const checked = value === 'true';

  if (!name) return null;

  return (
    <>
      <input
        {...{
          id: name,
          className: theme.checkbox,
          type: 'checkbox',
          name,
          defaultValue: false,
          checked,
          readOnly: true
        }}
      />
      <label {...{ htmlFor: name, className: theme.label }}>{label}</label>
    </>
  );
};

export default BoolLine;
