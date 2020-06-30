import React, { useContext } from 'react';
import { UI } from '@solid/lit-vocab-common';
import { ThemeContext } from '@context';
import { Wrapper, Label, Value } from './multi-line.style';

type Props = {
  id: string,
  data: object
};

export const MultiLine = (props: Props) => {
  const { id, data } = props;
  const { theme } = useContext(ThemeContext);
  const { [UI.label]: label, [UI.value]: value } = data;

  return (
    <div className={theme && theme.multiLine}>
      <Wrapper>
        <Label htmlFor={id} className="label">
          {label}
        </Label>
        <Value id={id} className="value">
          {value || ''}
        </Value>
      </Wrapper>
    </div>
  );
};

export default MultiLine;
