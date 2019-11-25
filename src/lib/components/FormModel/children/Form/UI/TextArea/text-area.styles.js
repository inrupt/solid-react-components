import styled from 'styled-components';

export const TextAreaGroup = styled.div`
  box-sizing: border-box;
  padding: 0.5em 1em;
  display: flex;
  align-items: center;
  width: 100%;
  & label {
    width: 100%;
  }
  & textarea {
    border-radius: 4px;
    border: solid 1px #ccc;
    padding: 0.5em;
    font-size: 0.8em;
    height: 100px;
  }
`;
