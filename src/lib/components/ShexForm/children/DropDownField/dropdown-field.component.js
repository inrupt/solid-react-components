import React from "react";
import unique from 'unique-string';
import { ThemeShex } from "@context";
import { DeleteButton } from "../";
import { ErrorMessage, SelectWrapper } from "./styled.component";

export const DropDownField = ({
  value,
  values,
  name,
  error,
  defaultValue,
  subject,
  onChange,
  onDelete,
  predicate,
  hasPrefix,
  parentPredicate,
  parent,
  canDelete,
  updateShexJ,
  fieldData
}) => {
  return (
    <ThemeShex.Consumer>
      {theme => (
        <SelectWrapper
          className={`${theme && theme.wrapperSelect} ${error ? "error" : ""}`}
        >
          <select
            className={theme && theme.select}
            value={value}
            name={name}
            onChange={onChange}
            data-predicate={predicate}
            data-subject={subject}
            data-default={defaultValue}
            data-prefix={hasPrefix}
            data-parent-predicate={parentPredicate}
          >
            {values.map(val => {
              const uVal = typeof val === 'string' ? val.split('#')[1] : val.value;

              return(<option value={uVal} key={unique()}>
                {uVal}
              </option>);
            })}
          </select>
          {error && (
            <ErrorMessage className={theme && theme.inputError}>
              {error}
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
