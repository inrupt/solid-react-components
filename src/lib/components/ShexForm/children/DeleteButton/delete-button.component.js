import React from "react";
import styled from "styled-components";
import { ThemeShex } from "@context";

const DeleteButtonWrapper = styled.button`
  position: absolute;
  right: 8px;
  color: red;
  border: none;
  background: none;
  cursor: pointer;
`;

export const DeleteButton = ({
  isParent,
  canDelete,
  onDelete,
  fieldData,
  predicate,
  updateShexJ
}) => {
  return !isParent && canDelete ? (
    <ThemeShex.Consumer>
      {theme => (
        <DeleteButtonWrapper
            className={theme && theme.deleteButton }
          type="button"
          onClick={() =>
            onDelete({ ...fieldData, predicate }, null, updateShexJ)
          }
        >
          X
        </DeleteButtonWrapper>
      )}
    </ThemeShex.Consumer>
  ) : null;
};
