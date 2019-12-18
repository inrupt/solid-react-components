import React from 'react';

import { Wrapper, Label, Value, ColorSwatch } from './color-line.style';

import { FormModelConfig } from '@context';
import { FormModelUI } from '@constants';

const ColorLine = ({ value, ...rest }: { value: String }) => {
  return (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <Wrapper className={theme && theme.colorLine}>
          <Label className="label">{rest[FormModelUI.UI_LABEL]}</Label>
          <Value className="value">
            {value}
            <ColorSwatch color={value} />
          </Value>
        </Wrapper>
      )}
    </FormModelConfig.Consumer>
  );
};

export default ColorLine;
