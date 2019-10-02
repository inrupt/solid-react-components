import styled from 'styled-components';

export const Group = styled.div`
  padding: ${({ parent }) => (parent ? '0' : '1em')};
  ${({ parent }) =>
    !parent
      ? `
  
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  `
      : `
  display: flex;
  flex-direction: column;`}
`;

export const Label = styled.span`
  font-weight: normal;
  font-size: 18px;
  letter-spacing: 0.5px;
  padding: 4px;
`;
