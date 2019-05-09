import styled from "styled-components";

export const ErrorMessage = styled.p`
  margin: 0;
  color: red;
  display: block;
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

export const InputGroup = styled.div`
  display: flex;
`;
