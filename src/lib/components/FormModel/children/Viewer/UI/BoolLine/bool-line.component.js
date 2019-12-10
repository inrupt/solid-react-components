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

  return (
    <label {...{ htmlFor: name, className: theme.boolLine }}>
      <input
        {...{
          type: 'checkbox',
          name,
          defaultValue: value === 'true',
          checked: value === 'true',
          readOnly: true,
          className: 'input-value'
        }}
      />
      <span {...{ className: theme.boolFieldLabel }}>{label}</span>
    </label>
  );
};

export default BoolLine;
