import React from "react";
import unique from "unique-string";
import { ShexConfig } from "@context";
import { isValueChanged } from '@utils';
import { DeleteButton } from "../";
import { ErrorMessage, SelectWrapper } from "./styled.component";

export const DropDownField = ({
  value,
  values,
  name,
  error,
  defaultValue,
  subject,
  predicate,
  hasPrefix,
  parentPredicate,
  parent,
  canDelete,
  fieldData
}) => {

  return (
    <ShexConfig.Consumer>
      {({
        theme,
        languageTheme,
        config: { onChange, onDelete, onSubmitSave }
      }) => (
        <SelectWrapper
          className={`${theme && theme.wrapperSelect} ${error ? "error" : ""}`}
        >
          <select
            className={theme && theme.select}
            value={value}
            name={name}
            onChange={ onChange }
            onBlur={() =>
                isValueChanged(value, defaultValue) &&
                onSubmitSave(name, "autoSave")
            }
            data-predicate={predicate}
            data-subject={subject}
            data-default={defaultValue}
            data-prefix={hasPrefix}
            data-parent-predicate={parentPredicate}
          >
            <option>
              {(languageTheme && languageTheme.dropdownDefaultText) ||
                "-- Select an option --"}
            </option>
            {values.map(val => {
              const uVal =
                typeof val === "string" ? val.split("#")[1] : val.value;
              const selectValue = typeof val === "string" ? val : val.value;

              return (
                <option value={selectValue} key={unique()}>
                  {uVal}
                </option>
              );
            })}
          </select>
          {error && (
            <ErrorMessage className={theme && theme.inputError}>
              {error}
            </ErrorMessage>
          )}
          {!parent && canDelete && (
            <DeleteButton
              {...{
                onDelete,
                isParent: parent,
                canDelete,
                predicate,
                fieldData
              }}
            />
          )}
        </SelectWrapper>
      )}
    </ShexConfig.Consumer>
  );
};
