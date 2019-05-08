import React from "react";
import {
  shexFormLabel,
  allowNewFields,
  canDelete,
  shexParentLinkOnDropDowns
} from "@utils";
import { Language, ThemeShex } from "@context";
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
  onChange: Function,
  onDelete: Function,
  addNewExpression: Function
};

const ShexForm = ({
  shexj,
  parent = null,
  onChange,
  onDelete,
  addNewShexField,
  updateShexJ,
  formValues
}: ShexFormProps) => {
  const { expression } = shexj;

  return shexj ? (
    <ThemeShex.Consumer>
      {theme => (
        <Panel
          className={`${
            theme ? (parent ? theme.shexPanel : theme.shexRoot) : ""
          }`}
        >
          {parent && canDelete(parent) && (
            <DeleteButton
              {...{
                onDelete,
                parent,
                updateShexJ,
                fieldData: shexj,
                floating: true,
                canDelete: canDelete(parent)
              }}
            />
          )}

          {expression &&
          expression.expressions &&
          expression.expressions.length > 0 ? (
            expression.expressions.map((expression, i) => {
              if (typeof expression.valueExpr === "string") {
                return (
                  <React.Fragment key={i}>
                    <Language.Consumer>
                      {({ language }) => (
                        <h4>{shexFormLabel(expression, language)}</h4>
                      )}
                    </Language.Consumer>
                    {expression._formValues.map((shexj, i) => (
                      <ShexForm
                        {...{
                          key: i,
                          parent: expression,
                          shexj,
                          onChange,
                          onDelete,
                          formValues,
                          addNewShexField,
                          updateShexJ
                        }}
                      />
                    ))}
                    <AddButton
                      {...{
                        allowNewFields: allowNewFields(expression),
                        defaultExpression: expression,
                        addNewShexField
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
                      onChange,
                      onDelete,
                      addNewShexField,
                      updateShexJ,
                      formValues,
                      parent
                    }}
                  />
                );
              }
            })
          ) : (
              shexj._formFocus && <DropDownField
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
                parentSubject: shexj._formFocus.parentSubject,
                onChange,
                onDelete,
                updateShexJ
              }}
            />
          )}
        </Panel>
      )}
    </ThemeShex.Consumer>
  ) : null;
};

export default ShexForm;
