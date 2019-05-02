import React from "react";
import { shexFormLabel } from "@utils";

export const AddButton = ({ addNewShexField, expression, defaultExpression, allowNewFields }) => {
  return (
    allowNewFields &&  (
      <button
        onClick={() => addNewShexField(defaultExpression, expression)}
        type="button"
      >
        Add new {shexFormLabel(defaultExpression)}
      </button>
    ) : null
  );
};
