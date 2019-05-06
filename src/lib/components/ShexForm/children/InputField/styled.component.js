import styled from "styled-components";

export const ErrorMessage = styled.p`
  margin: 0;
  color: red;
`;

export const InputWrapper = styled.div`
  position: relative;
  &.error {
    margin-bottom: 0;
  }
`;

export const Input = styled.input`
  .error & {
    margin-bottom: 5px;
  }
`;
