import React from "react";
import { ThemeShex } from "@context";
import { DeleteButton } from "../";
import { ErrorMessage, InputWrapper, Input } from "./styled.component";

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
        <InputWrapper
          className={`${theme && theme.inputContainer} ${
            inputData.error ? "error" : ""
          }`}
        >
          <Input
            className={theme && theme.input}
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
          {inputData.error && (
            <ErrorMessage className={theme && theme.inputError}>
              {inputData.error}
            </ErrorMessage>
          )}
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
        </InputWrapper>
      )}
    </ThemeShex.Consumer>
  );
};
