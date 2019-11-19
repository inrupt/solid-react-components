import React from 'react';
import { FormModelConfig } from '@context';
import { Wrapper, Label, Value } from './date-line.style';

const DateLine = ({ value, ...rest }: { value: String }) => {
  return value ? (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <Wrapper className={theme && theme.dateLineViewerClass}>
          <Label className="label">{rest['ui:label']}</Label>
          <Value className="value">{new Date(value)}</Value>
        </Wrapper>
      )}
    </FormModelConfig.Consumer>
  ) : null;
};

export default DateLine;
