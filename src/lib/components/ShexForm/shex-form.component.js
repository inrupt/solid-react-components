import React from "react";
import { ExpressionFields, DropdownFields } from "./children";
import styled from "styled-components";
import { useForm } from "@hooks";
import { shexFormLabel } from "@utils";

const Panel = styled.div`
  border: solid 1px red;
  padding: 10px;
  position: relative;
  margin: 10px 0;

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style: none;
  }

  select {
    display: block;
    margin: 20px 0;
    padding: 10px;
  }

  label {
    display: block;
    margin-top: 15px;
  }

  button {
    margin: 20px 0;
    border: 1px solid hsl(0, 0%, 80%);
    cursor: pointer;
    padding: 10px 30px;
  }
`;

const FormComponent = styled.form`
  button {
    margin: 20px 10px;
    border: 1px solid hsl(0, 0%, 80%);
    cursor: pointer;
    padding: 10px 30px;
  }
`;

const DeleteButton = styled.button`
  display: inline-flex;
  position: absolute;
  right: 8px;
  top: 5px;
  color: red;
  border: none;
  background: none;
  cursor: pointer;
  z-index: 100;
`;

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
  onDeleteExpression,
  formValues,
  addNewExpression,
  linkName
}: ShexFormProps) => {
  const { expression } = shexj;

  return shexj ? (
    <Panel>
      {parent && (
        <DeleteButton
          type="button"
          onClick={() =>
            onDelete(shexj, parent, onDeleteExpression)
          }
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
                    key={i}
                    shexj={shexj}
                    onChange={onChange}
                    onDelete={onDelete}
                    onDeleteExpression={onDeleteExpression}
                    formValues={formValues}
                    addNewExpression={addNewExpression}
                    parent={expression}
                  />
                ))}
                <button
                  onClick={() =>
                    addNewExpression(expression._formValues[0], expression)
                  }
                  type="button"
                >
                  Add new {shexFormLabel(expression)}
                </button>
              </React.Fragment>
            );
          } else {
            return (
              <ExpressionFields
                data={expression}
                key={i}
                onChange={onChange}
                onDelete={onDelete}
                onDeleteExpression={onDeleteExpression}
                formValues={formValues}
                addNewExpression={addNewExpression}
                parent={parent}
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

const Form = ({
  shexj,
  successCallback,
  errorCallback,
  addNewExpression,
  onDeleteExpression,
  documentUri
}) => {
  const { onSubmit, onChange, onDelete, onReset, formValues } = useForm(
    documentUri
  );
  return (
    <FormComponent onSubmit={e => onSubmit(e, successCallback, errorCallback)}>
      <ShexForm
        formValues={formValues}
        onChange={onChange}
        onDelete={onDelete}
        onDeleteExpression={onDeleteExpression}
        shexj={shexj}
        addNewExpression={addNewExpression}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onReset}>
        Reset
      </button>
    </FormComponent>
  );
};

Form.defaultProps = {
  successCallback: () => console.log("Form submitted successfully"),
  errorCallback: e => console.log("Error submitting form", e)
};

export default Form;
