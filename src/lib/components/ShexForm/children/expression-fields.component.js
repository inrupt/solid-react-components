import React, { Fragment } from "react";
import { shexFormLabel, allowNewFields, canDelete } from "@utils";
import { ShexConfig } from "@context";
import { AddButton } from "./";
import { Field } from "./";

type FieldsProps = {
  data: Object,
  formValues: Object,
  parent: Object
};

const ExpressionFields = ({ data, formValues, parent }: FieldsProps) => {
  return (
    <ShexConfig.Consumer>
      {({ languageTheme: { language } }) => (
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
      )}
    </ShexConfig.Consumer>
  );
};

export default ExpressionFields;
