import React, { Fragment } from "react";
import { shexFormLabel, allowNewFields, canDelete } from "@utils";
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
                  canDelete: canDelete(data)
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
