import styled from "styled-components";

export const Panel = styled.div`
  border: solid 1px red;
  padding: 10px;
  position: relative;
  margin: 10px 0;

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style: none;
  }

  select {
    display: block;
    margin: 20px 0;
    padding: 10px;
  }

  label {
    display: block;
    margin-top: 15px;
  }

  button {
    margin: 20px 0;
    border: 1px solid hsl(0, 0%, 80%);
    cursor: pointer;
    padding: 10px 30px;
    top: 0;
  }
`;

export const DeleteButton = styled.button`
  display: inline-flex;
  position: absolute;
  right: 8px;
  top: 5px;
  color: red;
  border: none;
  background: none;
  cursor: pointer;
  z-index: 100;
`;


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


export const Label = styled.label`
`