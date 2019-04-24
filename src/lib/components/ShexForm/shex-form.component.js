import React from "react";
import { ExpressionFields, DropdownFields } from "./children";
import styled from "styled-components";
import { useForm } from "@hooks";
import { shexFormLabel, allowNewFields } from "@utils";

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

const Form = ({
  shexj,
  successCallback,
  errorCallback,
  updateShexJ,
  addNewShexField,
  documentUri
}) => {
  const { onSubmit: submit, onChange, onDelete, onReset, formValues } = useForm(
    documentUri
  );

  const update = async () => {
    for await (const key of Object.keys(formValues)) {
      updateShexJ(formValues[key].name, "update", {
        isNew: false,
        value: formValues[key].value
      });
    }
  };

  const onSubmit = e => {
    try {
      submit(e);
      update();
      successCallback();
    } catch (e) {
      errorCallback(e);
    }
  };

  return (
    <FormComponent onSubmit={onSubmit}>
      <ShexForm
        {...{
          formValues,
          onChange,
          onDelete,
          addNewShexField,
          updateShexJ,
          shexj
        }}
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
