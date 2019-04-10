import React from "react";

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
  return (
    <div>
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
    </div>
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
        <option value={value} key={value}>{value.split("#")[1]}</option>
      ))}
    </select>
  );
};

export default Fields;
