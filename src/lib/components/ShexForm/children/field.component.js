import React, { useState, useEffect } from "react";

const Fields = props => {
  const { data } = props;
  const label = data.predicate.includes("#")
    ? data.predicate.split("#")[1]
    : data.predicate.split("/").pop();
  const values = data._formValues
    ? data._formValues.map(value => value._formFocus.value)
    : [];

  return (
    <div>
      <label>{label}</label>
      <ul>
        {values.map((value, i) => (
          <li key={i}>
            <Field {...{ data, value }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

type FieldProps = {
  data: Object,
  value: String
};

const Field = ({ data, value }: FieldProps) => {
  const { fieldData, setFieldData } = useState();
    const inputType = data.valueExpr.values ? "select" : "text";
    const init = () => {
    const fieldData = {
      value,
      error: null,
      predicate: "",
      subject: ""
    };

    setFieldData(fieldData);
  };

  useEffect(() => {
    init();
  }, [props.formData]);

  return inputType === 'text' ? <input type='text' value={fieldData.value} /> : <select>{data.valueExpr.values.map(value => <option value={value}>{value.split("#")[1]}</option>)}</select>;
};


export default Fields;

