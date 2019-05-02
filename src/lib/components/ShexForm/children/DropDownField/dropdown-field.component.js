import React from "react";
import { ThemeShex } from "@context";
import { DeleteButton } from "../";
import { ErrorMessage, SelectWrapper, Select } from "./styled.component";

export const DropDownField = ({
  inputData,
  onChange,
  onDelete,
  predicate,
  hasPrefix,
  parentPredicate,
  data,
  parent,
  canDelete,
  updateShexJ,
  fieldData
}) => {
  return (
    <ThemeShex.Consumer>
      {theme => (
        <SelectWrapper
          className={`${theme && theme.wrapperSelect} ${
            inputData.error ? "error" : ""
          }`}
        >
          <Select
            className={theme && theme.select}
            value={inputData.value}
            name={inputData.name}
            onChange={onChange}
            data-predicate={predicate}
            data-subject={fieldData._formFocus.parentSubject}
            data-default={fieldData._formFocus.value}
            data-prefix={hasPrefix}
            data-parent-predicate={parentPredicate}
          >
            {data.valueExpr.values.map(value => (
              <option value={value} key={value}>
                {value.split("#")[1]}
              </option>
            ))}
          </Select>
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
        </SelectWrapper>
      )}
    </ThemeShex.Consumer>
  );
};
