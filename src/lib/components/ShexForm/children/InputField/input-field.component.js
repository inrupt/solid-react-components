import React from "react";
import { ThemeShex } from "@context";
import { DeleteButton } from "../";

export const InputField = ({
  valueExpr,
  predicate,
  inputData,
  hasPrefix,
  parentPredicate,
  parentSubject,
  onChange,
  onDelete,
  parent,
  canDelete,
  updateShexJ,
  fieldData
}) => {
  return (
    <ThemeShex.Consumer>
      {theme => (
        <div className={theme && theme.input}>
          <input
            type="text"
            value={inputData.value}
            name={inputData.name}
            onChange={onChange}
            data-predicate={predicate}
            data-subject={fieldData._formFocus.parentSubject}
            data-default={fieldData._formFocus.value}
            data-prefix={hasPrefix}
            data-parent-predicate={parentPredicate}
            data-valuexpr={JSON.stringify(valueExpr)}
            data-parent-subject={parentSubject}
          />
          {inputData.error && <p className={ theme && theme.inputError }>{inputData.error}</p>}
          <DeleteButton
            {...{
              onDelete,
              isParent: parent,
              canDelete,
              predicate,
              updateShexJ,
              fieldData
            }}
          />
        </div>
      )}
    </ThemeShex.Consumer>
  );
};
