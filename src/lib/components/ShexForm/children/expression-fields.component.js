import React, { Fragment } from "react";
import { shexFormLabel, allowNewFields, canDelete } from "@utils";
import { Language } from "@context";
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
  parent,
  parentName
}: FieldsProps) => {
  return (
    <Fragment>
      <Language.Consumer>
        {({ language }) => (
          <Fragment>
            <label>{shexFormLabel(data, language)}</label>
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
                        parent,
                        parentName,
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
        )}
      </Language.Consumer>
    </Fragment>
  );
};

export default ExpressionFields;
