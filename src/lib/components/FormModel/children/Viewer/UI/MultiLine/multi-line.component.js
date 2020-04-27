import React, { useContext } from 'react';
import { Wrapper, Label, Value } from './multi-line.style';

import { ThemeContext } from '@context';
import { UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

type Props = {
  id: string,
  data: object
};

export const MultiLine = (props: Props) => {
  const { id, data } = props;
  const { theme } = useContext(ThemeContext);
  const { [UI.label.value]: label, [UI.value.value]: value } = data;

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
