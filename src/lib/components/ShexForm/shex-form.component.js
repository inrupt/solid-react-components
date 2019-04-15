import React from "react";
import { ExpressionFields, DropdownFields } from "./children";
import styled from "styled-components";
import { useForm } from "@hooks";

const Panel = styled.div`
  border: solid 1px red;
  padding: 10px;
`;

type ShexFormProps = {
  shexj: Object,
  parent: Object | null,
  formValues: Object,
  onChange: Function
};

const ShexForm = ({
  shexj,
  parent = null,
  onChange,
  formValues,
  addNewExpression
}: ShexFormProps) => {
  const { expression, values } = shexj;

  return shexj ? (
    <Panel>
      {parent && parent.predicate && (
        <h4>{parent.predicate.split("#has")[1]}</h4>
      )}
      {expression &&
      expression.expressions &&
      expression.expressions.length > 0 ? (
        expression.expressions.map((expression, i) => {
          if (typeof expression.valueExpr === "string") {
            return expression._formValues.map((shexj, i) => (
              <ShexForm
                key={i}
                shexj={shexj}
                onChange={onChange}
                formValues={formValues}
                addNewExpression={addNewExpression}
                parent={expression}
              />
            ));
          } else {
            return (
              <ExpressionFields
                data={expression}
                key={i}
                onChange={onChange}
                formValues={formValues}
                addNewExpression={addNewExpression}
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

const Form = ({ shexj, successCallback, errorCallback, addNewExpression }) => {
  const { onSubmit, onChange, onReset, formValues } = useForm();
  return (
    <form onSubmit={e => onSubmit(e, successCallback, errorCallback)}>
      <ShexForm
        formValues={formValues}
        onChange={onChange}
        shexj={shexj}
        addNewExpression={addNewExpression}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onReset}>
        Reset
      </button>
    </form>
  );
};

Form.defaultProps = {
  successCallback: () => console.log("Form submitted successfully"),
  errorCallback: e => console.log("Error submitting form", e)
};

export default Form;
