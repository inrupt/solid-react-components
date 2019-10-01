import React from 'react';
import { Wrapper, Label, Value } from './single-line.style';

const SingleLine = ({ value, ...rest }) => {
  return value ? (
    <Wrapper>
      <Label>{rest['ui:label']}</Label>
      <Value>{value}</Value>
    </Wrapper>
  ) : null;
};

export default SingleLine;
