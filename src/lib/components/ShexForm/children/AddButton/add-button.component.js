import React from "react";
import { shexFormLabel } from "@utils";
import { ThemeShex, Language } from "@context";

export const AddButton = ({
  addNewShexField,
  expression,
  defaultExpression,
  allowNewFields,
  text = "+ Add new"
}) => {
  return (allowNewFields && (
    <ThemeShex.Consumer>
      {theme => (
        <Language.Consumer>
          {({ language, addButtonText }) => (
            <button
              onClick={() => addNewShexField(defaultExpression, expression)}
              type="button"
              className={theme && theme.addButtonStyle}
            >
              {addButtonText || text}{" "}
              {shexFormLabel(defaultExpression, language)}
            </button>
          )}
        </Language.Consumer>
      )}
    </ThemeShex.Consumer>
  ): null);
};
