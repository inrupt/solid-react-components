import React from 'react';
import styled from 'styled-components';
import withWebId from './WithWebId';
import SolidImg from '../../assets/solid_logo.png';

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

const Example = (props) => {
  return (
    <ExampleWrapper>
      <img src={SolidImg} alt="React logo" width="62" />
      <Headline>Solid React Components</Headline>
    </ExampleWrapper>
  );
};

export default withWebId(Example);
