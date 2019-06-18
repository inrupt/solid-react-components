import styled from 'styled-components';

export const Item = styled.div`
  cursor: pointer;
  display: block;
  padding: 10px 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  &:last-child {
    border: none;
  }

  &:hover {
    background-color: #ebf5ff;
  }
`;

export const Icon = styled.img`
  width: 32px;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
`;

export const ItemText = styled.span`
  display: inline-block;
  vertical-align: middle;
`;
