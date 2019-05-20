import React, { Fragment } from "react";
import { allowNewFields, canDelete } from "@utils";
import { AddButton } from "./";
import { Field } from "./";

type FieldsProps = {
  data: Object,
  formValues: Object,
  parent: Object
};

const ExpressionFields = ({ data, formValues, parent }: FieldsProps) => {
  return (
    <Fragment>
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
          expression: parent
        }}
      />
    </Fragment>
  );
};

export default ExpressionFields;
