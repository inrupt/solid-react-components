import React from "react";
import { ThemeShex } from "@context";
import { DeleteButton } from "../";

export const DropDownField = ({
  inputData,
  onChange,
  onDelete,
  predicate,
  hasPrefix,
  parentPredicate,
  data,
  error,
  parent,
  canDelete,
  updateShexJ,
  fieldData
}) => {
  return (
    <ThemeShex.Consumer>
      {theme => (
        <div className={theme && theme.select}>
          <select
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
          </select>
          {error && <p>{error}</p>}
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
