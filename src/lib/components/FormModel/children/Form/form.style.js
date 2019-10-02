import styled from 'styled-components';

export const Group = styled.div`
  padding: 1em;
  border: ${({ parent }) => (parent ? 'solid 1px green' : 'none')};
  display: flex;
  flex-direction: column;
`;
