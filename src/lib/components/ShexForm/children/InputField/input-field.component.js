import React from "react";
import { ShexConfig } from "@context";
import { shexUtil } from '@utils';
import { DeleteButton } from "../";
import {
  ErrorMessage,
  InputWrapper,
  Input,
  InputGroup
} from "./styled.component";

export const InputField = ({
  type = "text",
  valueExpr,
  predicate,
  inputData,
  hasPrefix,
  parentPredicate,
  parentSubject,
  parent,
  canDelete,
  fieldData
}) => {
  const inputName = inputData && inputData.name;
  const defaultValue = fieldData && fieldData._formFocus.value;
  const currentValue = inputData && inputData.value;

  return (
    <ShexConfig.Consumer>
      {({ theme, config: { onChange, onSubmitSave, autoSaveMode } }) => (
        <InputWrapper
          className={`${theme && theme.inputContainer} ${
            inputData && inputData.error ? "error" : ""
          }`}
        >
          <InputGroup>
            <Input
              className={theme && theme.input}
              type={type}
              value={currentValue}
              name={inputName}
              onChange={onChange}
              data-predicate={predicate}
              data-subject={fieldData && fieldData._formFocus.parentSubject}
              data-default={defaultValue}
              data-prefix={hasPrefix}
              data-parent-predicate={parentPredicate}
              data-valuexpr={JSON.stringify(valueExpr)}
              data-parent-subject={parentSubject}
              data-parent-name={
                parent && parent._formFocus ? parent._formFocus.name : null
              }
              onBlur={() =>
                  autoSaveMode && shexUtil.isValueChanged(currentValue, defaultValue) &&
                onSubmitSave(inputName, "autoSave")
              }
            />
            {!parent && canDelete && (
              <DeleteButton
                {...{
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
    </ShexConfig.Consumer>
  );
};
