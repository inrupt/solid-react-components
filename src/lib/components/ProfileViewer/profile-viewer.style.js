import styled from 'styled-components';

export const ProfileCard = styled.div`
  border: solid 1px #ccc;
  border-radius: 8px;
  min-width: 200px;
  width: auto;
  min-height: 200px;
  height: auto;
  box-shadow: #ccc 2px 2px 8px;
  padding: 6px;
  position: absolute;
  z-index:1000;
  background-color: #fff;
  
  bottom: ${({ direction }) => (direction === 'up' ? '20px' : 'auto')}
  top: ${({ direction }) => (direction === 'down' ? '20px' : 'auto')}
  
  img {
    max-width: 100%;
  }

`;

export const ProfileViewerWrapper = styled.span`
  position: relative;
`;
