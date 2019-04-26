import React from "react";
import { ExpressionFields, DropdownFields } from "./children";
import { shexFormLabel, allowNewFields } from "@utils";
import { Panel, DeleteButton } from './styled.component';


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
      {parent && (
        <DeleteButton
          type="button"
          onClick={() => onDelete(shexj, parent, updateShexJ)}
        >
          X
        </DeleteButton>
      )}

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
                {allowNewFields(expression) && (
                  <button
                    onClick={() =>
                      addNewShexField(expression._formValues[0], expression)
                    }
                    type="button"
                  >
                    Add new {shexFormLabel(expression)}
                  </button>
                )}
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
