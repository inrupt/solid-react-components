import React, { Fragment, useState } from "react";
import { shexFormLabel, findAnnotation } from "@utils";
import styled from "styled-components";
const InputWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
`;
const DeleteButton = styled.button`
display: ${({ show }) => (show ? "flex" : "none")}
position: absolute;
right: 8px;
color: red;
border: none;
background: none;
cursor: pointer;
`;
type FieldsProps = {
  formValues: Object,
  onChange: Function,
  data: Object
};

const allowNewFields = (data: Object) => {
  const totalData = data._formValues.length;

  if ((!data.min && !data.max) || (data.min > 0 && data.max < totalData)) {
    return true;
  }

  return false;
};

const ExpressionFields = (props: FieldsProps) => {
  const {
    data,
    onChange,
    onDelete,
    formValues,
    addNewExpression,
    onDeleteExpression,
    parent
  } = props;
  const label = shexFormLabel(data);
  return (
    <Fragment>
      <label>{label}</label>
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
                  onChange,
                  onDelete,
                  onDeleteExpression,
                  parent,
                  count: i
                }}
              />
            </li>
          ))}
      </ul>
      {allowNewFields(data) && !parent && (
        <button type="button" onClick={() => addNewExpression(data, parent)}>
          Add new {label}
        </button>
      )}
    </Fragment>
  );
};

type FieldProps = {
  data: Object,
  inputData: Object,
  onChange: (e: Event) => {}
};

const Field = ({
  data,
  fieldData,
  inputData,
  onChange,
  onDelete,
  onDeleteExpression,
  count,
  parent
}: FieldProps) => {
  const [hover, setHover] = useState(false);
  const inputType = data.valueExpr.values ? "select" : "text";
  const predicate = data.predicate;
  const subject = fieldData._formFocus.parentSubject;
  const defaultValue = fieldData._formFocus.value;
  const annotation = findAnnotation(
    "layoutprefix",
      data.annotations
  );
  const hasPrefix = annotation && annotation.object.value;

  const onMouseEnter = () => setHover(true);

  const onMouseLeave = () => setHover(false);

  const checkNumber = data => {
    return data.min ? count > data.min : true;
  };

  if(!subject)
  console.log("NO Subject", data,fieldData);
  return (
    <InputWrapper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {inputType === "text" ? (
        <input
          type="text"
          value={inputData.value}
          name={inputData.name}
          onChange={onChange}
          data-predicate={predicate}
          data-subject={subject}
          data-default={defaultValue}
          data-prefix={hasPrefix}
          data-parent-predicate={
            parent && parent.predicate ? parent.predicate : null
          }
        />
      ) : (
        <select
          value={inputData.value}
          name={inputData.name}
          onChange={onChange}
          data-predicate={predicate}
          data-subject={subject}
          data-default={defaultValue}
          data-prefix={hasPrefix}
          data-parent-predicate={
            parent && parent.predicate ? parent.predicate : null
          }
        >
          {data.valueExpr.values.map(value => (
            <option value={value} key={value}>
              {value.split("#")[1]}
            </option>
          ))}
        </select>
      )}
      {!parent && checkNumber(data) && (
        <DeleteButton
          type="button"
          show={hover}
          onClick={() =>
            onDelete(
              { subject, predicate, defaultValue },
              null,
              onDeleteExpression
            )
          }
        >
          X
        </DeleteButton>
      )}
    </InputWrapper>
  );
};

export default ExpressionFields;
