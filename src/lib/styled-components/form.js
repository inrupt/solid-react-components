import styled from 'styled-components';

export const SolidInput = styled.input`
  background-color: hsl(0, 0%, 100%);
  border-color: hsl(0, 0%, 80%);
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  width: 100%;
  padding: 2px 8px;
  height: 30px;
`;

export const SolidLinkButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const SolidButton = styled.button`
  border: 1px solid hsl(0, 0%, 80%);
  cursor: pointer;
  padding: 10px 30px;

  &:hover {
    opacity: 0.7;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  margin: 0;
`;
