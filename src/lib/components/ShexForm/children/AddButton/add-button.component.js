import React from "react";
import { shexFormLabel } from "@utils";
import { Language } from "@context";

export const AddButton = ({
  addNewShexField,
  expression,
  defaultExpression,
  allowNewFields,
  text = "+ Add new"
}) => {
  return (allowNewFields && (
    <Language.Consumer>
      {({ language, addButtonText }) => (
        <button
          onClick={() => addNewShexField(defaultExpression, expression)}
          type="button"
        >
          {addButtonText || text} {shexFormLabel(defaultExpression, language)}
        </button>
      )}
    </Language.Consumer>
  ): null);
};
