import React from "react";
import styled from "styled-components";
import { ThemeShex } from "@context";
import { Language } from "@context";

const DeleteButtonWrapper = styled.button`
  position: absolute;
  right: 8px;
  color: red;
  border: none;
  background: none;
  cursor: pointer;
  z-index: 1;
`;

export const DeleteButton = ({
  onDelete,
  fieldData,
  predicate,
  updateShexJ,
  parent,
  text = "Remove"
}) => {
  return (
    <ThemeShex.Consumer>
      {theme => (
        <Language.Consumer>
          {({ deleteButton }) => (
            <DeleteButtonWrapper
              className={theme && theme.deleteButton}
              type="button"
              onClick={() =>
                onDelete(predicate ? { ...fieldData, predicate } : fieldData, parent, updateShexJ)
              }
            >
              {deleteButton || text}
            </DeleteButtonWrapper>
          )}
        </Language.Consumer>
      )}
    </ThemeShex.Consumer>
  );
};
