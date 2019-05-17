import React from "react";
import { ThemeShex } from "@context";
import { DeleteButton } from "../";
import {
  ErrorMessage,
  InputWrapper,
  Input,
  InputGroup
} from "./styled.component";

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
  fieldData
}) => {
  return (
    <ThemeShex.Consumer>
      {theme => (
        <InputWrapper
          className={`${theme && theme.inputContainer} ${
            inputData && inputData.error ? "error" : ""
          }`}
        >
          <InputGroup>
            <Input
              className={theme && theme.input}
              type="text"
              value={inputData && inputData.value}
              name={inputData && inputData.name}
              onChange={onChange}
              data-predicate={predicate}
              data-subject={fieldData && fieldData._formFocus.parentSubject}
              data-default={fieldData && fieldData._formFocus.value}
              data-prefix={hasPrefix}
              data-parent-predicate={parentPredicate}
              data-valuexpr={JSON.stringify(valueExpr)}
              data-parent-subject={parentSubject}
              data-parent-name={parent && parent._formFocus ? parent._formFocus.name : null }
              onBlur={() => console.log('hello') }
            />
            {!parent && canDelete && (
              <DeleteButton
                {...{
                  onDelete,
                  predicate,
                  fieldData
                }}
              />
            )}
          </InputGroup>
          {inputData && inputData.error && (
            <ErrorMessage className={theme && theme.inputError}>
              {inputData.error}
            </ErrorMessage>
          )}
        </InputWrapper>
      )}
    </ThemeShex.Consumer>
  );
};
