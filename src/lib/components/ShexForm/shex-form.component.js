import React from "react";
import { Fields } from "./children";
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
}

const ShexForm = ({ shexj, parent = null, onChange, formValues } : ShexFormProps) => {
  const expression = shexj ? shexj.expression : {};
  return shexj ? (
    <Panel>
      {parent && parent.predicate && (
        <h4>{parent.predicate.split("#has")[1]}</h4>
      )}
      {expression &&
        expression.expressions.map((expression, i) => {
          if (typeof expression.valueExpr === "string") {
            return expression._formValues.map((shexj, i) => (
              <ShexForm key={i} shexj={shexj} onChange={onChange} formValues={formValues} parent={expression}/>
            ));
          } else {
            return <Fields data={expression} key={i} onChange={onChange} formValues={formValues}/>;
          }
        })}
    </Panel>
  ): null;
};

const Form = ({shexj, successCallback, errorCallback}) => {
  const { onSubmit, onChange, formValues } = useForm();
  return (
    <form onSubmit={(e) => onSubmit(e,successCallback,errorCallback)}>
      <ShexForm formValues={formValues} onChange={onChange} shexj={shexj} />
      <button type="submit">Save</button>
    </form>
  );
};

Form.defaultProps = {
    successCallback : () => console.log('Form submitted successfully'),
    errorCallback : () => console.log('Error submitting form')
}

export default Form;
