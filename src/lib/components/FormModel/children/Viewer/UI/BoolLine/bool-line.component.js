import React from 'react';
import { FormModelConfig } from '@context';
import { Label } from './bool-line.style';

import { FormModelUI } from '@constants';

type Props = {
  value: Object
};

const BoolLine = ({ value, ...rest }: Props) => {
  return (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <Label htmlFor={rest[FormModelUI.UI_NAME]} className={theme && theme.boolLine}>
          <input
            type="checkbox"
            name={rest[FormModelUI.UI_NAME]}
            defaultValue={value === 'true'}
            checked={value === 'true'}
            readOnly
            className="input-value"
          />
          <span className="label-text">{rest['ui:label'] || 'Label'}</span>
        </Label>
      )}
    </FormModelConfig.Consumer>
  );
};

export default BoolLine;
