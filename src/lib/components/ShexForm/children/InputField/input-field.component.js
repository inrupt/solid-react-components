import React, { Fragment } from "react";
import { ShexConfig } from "@context";
import { isValueChanged } from "@utils";
import { DeleteButton } from "../";
import { ErrorMessage, Input, InputGroup } from "../../styled.component";

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

  const dataObj = {
    predicate,
    defaultValue,
    parentPredicate,
    parentSubject,
    valueExpr,
    prefix:hasPrefix,
    subject : fieldData && fieldData._formFocus.parentSubject,
    parentName : parent && parent._formFocus ? parent._formFocus.name : null
  }

  return (
    <ShexConfig.Consumer>
      {({ theme, config: { onChange, onSubmitSave } }) => (
        <Fragment>
          <InputGroup>
            <Input
              className={theme && theme.input}
              type={type}
              value={currentValue}
              name={inputName}
              onChange={onChange}
              data-obj={JSON.stringify(dataObj)}
              onBlur={() =>
                isValueChanged(currentValue, defaultValue) &&
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
        </Fragment>
      )}
    </ShexConfig.Consumer>
  );
};
