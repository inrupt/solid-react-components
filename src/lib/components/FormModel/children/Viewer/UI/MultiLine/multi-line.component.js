import React from 'react';
import { Wrapper, Label, Value } from './multi-line.style';

import { FormModelConfig } from '@context';
import { FormModelUI } from '@constants';

const MultiLine = ({ value, ...rest }: { value: String }) => {
  return (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <Wrapper className={theme && theme.multiLineViewerClass}>
          <Label className="label">{rest[FormModelUI.UI_LABEL]}</Label>
          <Value className="value">{value || ''}</Value>
        </Wrapper>
      )}
    </FormModelConfig.Consumer>
  );
};

export default MultiLine;
