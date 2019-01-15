import React from 'react';
import styled from 'styled-components';
import solidLogo from './logo.svg';

const ExampleWrapper = styled.section`
  margin-top: 60px;
  text-align: center;
  width: 100%;
`;

const Headline = styled.h1`
  color: #333;
  font-size: 36px;
  font-weight: 300;
`;

const Example = () => (
  <ExampleWrapper>
    <img src={solidLogo} alt="React logo" width="62" />
    <Headline>Solid React Components</Headline>
  </ExampleWrapper>
);

export default Example;
