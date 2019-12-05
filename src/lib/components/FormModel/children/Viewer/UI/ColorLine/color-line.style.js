import styled from 'styled-components';

export const Wrapper = styled.div`
  //display: flex;
  padding: 8px 0;
  flex-direction: column;
`;

export const Label = styled.span`
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 0.4px;
`;

export const Value = styled.span`
  display: inline-flex;
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
