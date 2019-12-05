import React from 'react';
import { FormModelConfig } from '@context';
import { Wrapper, Label, Value } from './single-line.style';

import { FormModelUI } from '@constants';

const SingleLine = ({ value, ...rest }: { value: String }) => {
  return value ? (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <Wrapper className={theme && theme.singleLineViewerClass}>
          <Label className="label">{rest[FormModelUI.UI_LABEL]}</Label>
          <Value className="value">{value}</Value>
        </Wrapper>
      )}
    </FormModelConfig.Consumer>
  ) : null;
};

export default SingleLine;
