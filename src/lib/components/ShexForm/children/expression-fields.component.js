import React, { Fragment } from "react";
import { shexFormLabel, allowNewFields } from "@utils";
import { AddButton } from "./";
import { Field } from "./";

type FieldsProps = {
  formValues: Object,
  onChange: Function,
  data: Object
};

const ExpressionFields = ({
  data,
  onChange,
  onDelete,
  formValues,
  addNewShexField,
  updateShexJ,
  parent
}: FieldsProps) => {
  const label = shexFormLabel(data);

  const canDelete =
    data.min === undefined || data.min === 1
      ? data._formValues.length > 1
      : true;

  return (
    <Fragment>
      <label>{label}</label>
      <ul>
        {data._formValues &&
          data._formValues.map((value, i) => (
            <li key={i}>
              <Field
                {...{
                  data,
                  fieldData: value,
                  inputData:
                    formValues[value._formFocus.name] || value._formFocus,
                  onChange,
                  onDelete,
                  updateShexJ,
                  parent,
                  canDelete
                }}
              />
            </li>
          ))}
      </ul>
      <AddButton
        {...{
          allowNewFields: allowNewFields(data) && !parent,
          defaultExpression: data,
          expression: parent,
          addNewShexField
        }}
      />
    </Fragment>
  );
};

export default ExpressionFields;
