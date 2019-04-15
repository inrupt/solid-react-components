import React, { Fragment } from "react";

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
  const { data, onChange, formValues, addNewExpression } = props;
  const label = data.predicate.includes("#")
    ? data.predicate.split("#")[1]
    : data.predicate.split("/").pop();
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
                  onChange
                }}
              />
            </li>
          ))}
      </ul>
      {allowNewFields(data) && (
        <button onClick={() => addNewExpression(data, parent)} type="button">
          Add new label
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

const Field = ({ data, fieldData, inputData, onChange }: FieldProps) => {
  const inputType = data.valueExpr.values ? "select" : "text";
  const predicate = data.predicate;
  const subject = fieldData._formFocus.parentSubject;
  const defaultValue = fieldData._formFocus.value;

  return inputType === "text" ? (
    <input
      type="text"
      value={inputData.value}
      name={inputData.name}
      onChange={onChange}
      data-predicate={predicate}
      data-subject={subject}
      data-default={defaultValue}
    />
  ) : (
    <select
      value={inputData.value}
      name={inputData.name}
      onChange={onChange}
      data-predicate={predicate}
      data-subject={subject}
      data-default={defaultValue}
    >
      {data.valueExpr.values.map(value => (
        <option value={value} key={value}>
          {value.split("#")[1]}
        </option>
      ))}
    </select>
  );
};

export default ExpressionFields;
