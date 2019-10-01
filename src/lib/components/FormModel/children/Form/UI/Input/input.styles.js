import styled from 'styled-components';

export const Label = styled.label`
  box-sizing: border-box;
  padding: 0.5em 1em;
  display: flex;
  align-items: center;
  & input {
    border-radius: 2px;
    border: solid 1px #ccc;
    padding: 0.5em;
    margin-left: 1em;
  }
`;
