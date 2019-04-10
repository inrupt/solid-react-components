import React, { useState, useEffect } from "react";

type FieldsProps = {
  formValues: Object,
  onChange: Function,
  data: Object
};

const Fields = (props: FieldsProps) => {
  const { data, onChange, formValues } = props;
  const label = data.predicate.includes("#")
    ? data.predicate.split("#")[1]
    : data.predicate.split("/").pop();
  const values = data._formValues
    ? data._formValues.map(value => value._formFocus)
    : [];

  return (
    <div>
      <label>{label}</label>
      <ul>
        {values.map((formFocus, i) => (
          <li key={i}>
            <Field
              {...{
                data,
                inputData: formValues[formFocus.name] || formFocus,
                onChange
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

type FieldProps = {
  data: Object,
  inputData: Object,
  onChange: (e: Event) => {}
};

const Field = ({ data, inputData, onChange }: FieldProps) => {
  const inputType = data.valueExpr.values ? "select" : "text";
  const predicate = data.predicate;
  console.log("_formFocus",data)
  return inputType === "text" ? (
    <input
      type="text"
      value={inputData.value}
      name={inputData.name}
      onChange={onChange}
      data-predicate={data.predicate}
      data-subject={data._formFocus.parentSubject}
    />
  ) : (
    <select>
      {data.valueExpr.values.map(value => (
        <option value={value}>{value.split("#")[1]}</option>
      ))}
    </select>
  );
};

export default Fields;
