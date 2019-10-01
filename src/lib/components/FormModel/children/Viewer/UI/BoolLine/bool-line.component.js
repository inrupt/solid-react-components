import React from 'react';
import { Label } from './bool-line.style';

const BoolLine = ({ value, ...rest }) => {
  return value ? (
    <Label htmlFor={rest['ui:name']}>
      <input
        type="checkbox"
        name={rest['ui:name']}
        defaultValue={value === 'true'}
        checked={value === 'true'}
        readOnly
      />
      <span className="label-text">{rest['ui:label'] || 'Label'}</span>
    </Label>
  ) : null;
};

export default BoolLine;
