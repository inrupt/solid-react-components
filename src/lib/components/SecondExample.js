import React from 'react';
import styled from 'styled-components';

const SecondExampleWrapper = styled.section`
  text-align: center;
  width: 100%;
`;

const CopyText = styled.p`
  color: #4b5658;
  font-size: 20px;
`;

const Link = styled.a`
  color: #3079ab;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const SecondExample = () => (
  <SecondExampleWrapper>
    <CopyText>
      Based on Facebook's {'\u00A0'}
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/facebookincubator/create-react-app"
      >
        Create react app
      </Link>
    </CopyText>
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/Inrupt-inc/solid-react-components"
    >
      Documentation
    </Link>
  </SecondExampleWrapper>
);

export default SecondExample;
