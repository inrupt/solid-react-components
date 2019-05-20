import React from "react";
import { findAnnotation, shexFormLabel } from "@utils";
import { ShexConfig } from "@context";
import { InputField, DropDownField } from "../";
import { InputWrapper, Label } from "../../styled.component";

type FieldProps = {
  data: Object,
  inputData: Object
};

export const Field = ({
  data,
  fieldData,
  inputData,
  canDelete,
  parent
}: FieldProps) => {
  const inputType = data.valueExpr.values ? "select" : "text";
  const predicate = data.predicate;
  const annotation = findAnnotation("layoutprefix", data.annotations);
  const hasPrefix = annotation && annotation.object.value;
  const parentPredicate = parent && parent.predicate ? parent.predicate : null;
  const parentSubject = parent && parent._formFocus.parentSubject;
  return (
    <ShexConfig.Consumer>
      {({ theme, languageTheme: { language } }) => (
        <InputWrapper
          className={`${theme && theme.inputContainer ? theme.inputContainer : ''} ${
            inputData && inputData.error ? "error" : ""
          }`.trim()}
        >
          <Label>{shexFormLabel(data, language)}</Label>
          {inputType === "text" ? (
            <InputField
              {...{
                type: "text",
                fieldData,
                inputData,
                predicate,
                hasPrefix,
                parent,
                parentPredicate,
                parentSubject,
                canDelete,
                valueExpr: data.valueExpr,
                error: data.error
              }}
            />
          ) : (
            <DropDownField
              {...{
                fieldData,
                canDelete,
                predicate,
                hasPrefix,
                parent,
                parentPredicate,
                value: inputData.value,
                defaultValue: fieldData._formFocus.value,
                subject: fieldData._formFocus.parentSubject,
                name: inputData.name,
                values: data.valueExpr.values
              }}
            />
          )}
        </InputWrapper>
      )}
    </ShexConfig.Consumer>
  );
};
