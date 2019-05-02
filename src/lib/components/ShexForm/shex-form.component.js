import React from "react";
import { ExpressionFields, DropdownFields } from "./children";
import { shexFormLabel, allowNewFields } from "@utils";
import { Panel } from "./styled.component";
import { DeleteButton, AddButton } from "./children";
// import { DropDownField } from "./children/DropDownField";

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
    <Panel>
      <DeleteButton {...{ parent, onDelete, shexj, updateShexJ }} />
      {expression &&
      expression.expressions &&
      expression.expressions.length > 0 ? (
        expression.expressions.map((expression, i) => {
          if (typeof expression.valueExpr === "string") {
            return (
              <React.Fragment key={i}>
                <h4>{shexFormLabel(expression)}</h4>
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
                    defaultExpression: expression._formValues[0],
                    addNewShexField,
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
        <DropdownFields
          shexj={shexj}
          onChange={onChange}
          formValues={formValues}
          parent={parent}
        />
      )}
    </Panel>
  ) : null;
};

export default ShexForm;
