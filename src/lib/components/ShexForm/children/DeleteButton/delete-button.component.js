import React from "react";
import styled from "styled-components";
import { ShexConfig } from "@context";

const DeleteButtonWrapper = styled.button`
  position: ${({ floating }) => (floating ? "absolute" : "relative")};
  right: 8px;
  color: red;
  border: none;
  background: none;
  cursor: pointer;
  z-index: 1;
`;

export const DeleteButton = ({
  fieldData,
  predicate,
  parent,
  text = "Remove"
}) => {
  return (
    <ShexConfig.Consumer>
      {({ theme, languageTheme: { deleteButton }, config: { onDelete } }) => (
        <DeleteButtonWrapper
          className={theme && theme.deleteButton}
          type="button"
          onClick={() =>
            onDelete(
              predicate ? { ...fieldData, predicate } : fieldData,
              parent
            )
          }
          floating={parent}
        >
          {deleteButton || text}
        </DeleteButtonWrapper>
      )}
    </ShexConfig.Consumer>
  );
};
