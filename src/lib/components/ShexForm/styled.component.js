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
