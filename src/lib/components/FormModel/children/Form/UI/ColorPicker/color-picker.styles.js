import styled from 'styled-components';

export const PickerGroup = styled.div`
  box-sizing: border-box;
  padding: 0.5em 1em;
  display: flex;
  align-items: center;
  & label {
    padding: 0.5em;
    margin-right: 1em;
  }
`;

export const ColorSwatch = styled.div`
  width: 36px;
  height: 14px;
  padding: 5px;
  background: ${props => props.color};
  border-radius: 1px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
  cursor: pointer;
`;

export const Cover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const Popover = styled.div`
  position: absolute;
  z-index: 2;
`;
