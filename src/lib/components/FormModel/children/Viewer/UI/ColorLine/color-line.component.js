import React, { useContext } from 'react';
import { UI } from '@inrupt/lit-generated-vocab-common';
import { ThemeContext } from '@context';

import { Wrapper, Label, Value, ColorSwatch } from './color-line.style';

export const ColorLine = props => {
  const { id, data } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.label.value]: label, [UI.value.value]: value } = data;

  return (
    <Wrapper id={id} className={theme.colorLine}>
      <Label className="label">{label}</Label>
      <Value className="value">
        {value}
        <ColorSwatch color={value} />
      </Value>
    </Wrapper>
  );
};

export default ColorLine;
