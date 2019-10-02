import React from 'react';
import { FormModelConfig } from '@context';
import { Label } from './bool-line.style';

type Props = {
  value: Object
};

const BoolLine = ({ value, ...rest }: Props) => {
  return value ? (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <Label htmlFor={rest['ui:name']} className={theme && theme.boolLine}>
          <input
            type="checkbox"
            name={rest['ui:name']}
            defaultValue={value === 'true'}
            checked={value === 'true'}
            readOnly
            className="input-value"
          />
          <span className="label-text">{rest['ui:label'] || 'Label'}</span>
        </Label>
      )}
    </FormModelConfig.Consumer>
  ) : null;
};

export default BoolLine;
