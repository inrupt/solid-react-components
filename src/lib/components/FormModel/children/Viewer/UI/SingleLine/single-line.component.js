import React, { useContext } from 'react';
import { FormModelConfig } from '@context';
import { Wrapper, Label, Value } from './single-line.style';
import { FormModelUI } from '@constants';

const { UI_LABEL, UI_VALUE } = FormModelUI;

const DEFAULT = '';

const SingleLine = props => {
  const { theme } = useContext(FormModelConfig);

  const { [UI_LABEL]: label, [UI_VALUE]: value } = props;

  console.log('label', label);
  console.log('value', value);

  console.log(props);

  return (
    <Wrapper className={theme && theme.singleLineViewerClass}>
      <Label className="label">{label}</Label>
      <Value className="value">{value || DEFAULT}</Value>
    </Wrapper>
  );
};

export default SingleLine;
