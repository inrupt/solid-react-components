import styled from "styled-components";

export const ErrorMessage = styled.p`
  margin: 0;
  color: red;
`;

export const SelectWrapper = styled.div`
  &.error {
    margin-bottom: 0;
  }
`;

export const Select = styled.select`
  .error & {
    margin-bottom: 5px;
  }
`;
