import React, { useContext } from 'react';
import { ThemeContext } from '@context';
import { UI } from '@constants';

import { Wrapper, Label, Value, ColorSwatch } from './color-line.style';

export const ColorLine = props => {
  const { id, data } = props;
  const { theme } = useContext(ThemeContext);

  const { [UI.LABEL]: label, [UI.VALUE]: value } = data;

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
