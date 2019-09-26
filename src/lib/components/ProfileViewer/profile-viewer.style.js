import styled from 'styled-components';

export const ProfileCard = styled.div`
  border: solid 1px #ccc;
  border-radius: 8px;
  width: 240px;
  height: 240px;
  box-shadow: #ccc 2px 2px 8px;
  padding: 6px;
  position: absolute;
  z-index:1000;
  background-color: #fff;
  
  bottom: ${({ direction }) => (direction === 'up' ? '20px' : 'auto')}
  top: ${({ direction }) => (direction === 'down' ? '20px' : 'auto')}

`;

export const ProfileViewerWrapper = styled.span`
  position: relative;
`;
