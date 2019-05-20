import React from "react";
import {
  shexFormLabel,
  allowNewFields,
  canDelete,
  shexParentLinkOnDropDowns
} from "@utils";
import { ShexConfig } from "@context";
import { Panel } from "./styled.component";
import {
  DeleteButton,
  AddButton,
  DropDownField,
  ExpressionFields
} from "./children";

type ShexFormProps = {
  shexj: Object,
  parent: Object | null,
  formValues: Object,
  addNewExpression: Function
};

const ShexForm = ({ shexj, parent = null, formValues }: ShexFormProps) => {
  const { expression } = shexj;

  return shexj ? (
    <ShexConfig.Consumer>
      {({ theme, languageTheme: { language } }) => (
        <Panel
          className={`${
            theme ? (parent ? theme.shexPanel : theme.shexRoot) : ""
          }`}
        >
          {parent && canDelete(parent) && (
            <DeleteButton
              {...{
                parent,
                fieldData: shexj,
                floating: true,
                canDelete: canDelete(parent)
              }}
            />
          )}

          {expression &&
          expression.expressions &&
          expression.expressions.length > 0
            ? expression.expressions.map((expression, i) => {
                if (typeof expression.valueExpr === "string") {
                  return (
                    <React.Fragment key={i}>
                      <h4>{shexFormLabel(expression, language)}</h4>
                      {expression._formValues.map((shexj, i) => (
                        <ShexForm
                          {...{
                            key: i,
                            parent: {
                              ...expression,
                              _formFocus: shexj._formFocus
                            },
                            shexj,
                            formValues
                          }}
                        />
                      ))}
                      <AddButton
                        {...{
                          allowNewFields: allowNewFields(expression),
                          defaultExpression: expression
                        }}
                      />
                    </React.Fragment>
                  );
                } else {
                  return (
                    <ExpressionFields
                      {...{
                        data: expression,
                        key: i,
                        formValues,
                        parent,
                        parentName: shexj._formFocus
                          ? shexj._formFocus.name
                          : null
                      }}
                    />
                  );
                }
              })
            : shexj._formFocus && (
                <DropDownField
                  {...{
                    values: shexj.values,
                    value: formValues[shexj._formFocus.name]
                      ? formValues[shexj._formFocus.name].value
                      : shexj._formFocus.value,
                    fieldData: formValues[shexj] ? formValues[shexj] : shexj,
                    defaultValue: shexj._formFocus.value,
                    subject: shexj._formFocus.parentSubject,
                    name: shexj._formFocus.name,
                    label: shexFormLabel(parent),
                    canDelete: canDelete(parent),
                    predicate: parent.predicate,
                    parent,
                    parentPredicate: shexParentLinkOnDropDowns(parent),
                    parentSubject: shexj._formFocus.parentSubject
                  }}
                />
              )}
        </Panel>
      )}
    </ShexConfig.Consumer>
  ) : null;
};

export default ShexForm;
