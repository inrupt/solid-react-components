import React from 'react';
import { FormModelConfig } from '@context';
import { Wrapper, Label, Value } from './multi-line.style';

const MultiLine = ({ value, ...rest }: { value: String }) => {
  return value ? (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <Wrapper className={theme && theme.multiLineViewerClass}>
          <Label className="label">{rest['ui:label']}</Label>
          <Value className="value">{value}</Value>
        </Wrapper>
      )}
    </FormModelConfig.Consumer>
  ) : null;
};

export default MultiLine;
