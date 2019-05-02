import styled from "styled-components";

export const ErrorMessage = styled.p`
  margin: 0;
  color: red;
`;

export const InputWrapper = styled.div`
  &.error {
    margin-bottom: 0;
  }
`;

export const Input = styled.input`
  .error & {
    margin-bottom: 5px;
  }
`;
