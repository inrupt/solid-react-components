import React from "react";

const Field = props => {
  const { data } = props;
  const label = data.predicate.includes("#")
    ? data.predicate.split("#")[1]
    : data.predicate.split("/").pop();
  const values = data._formValues
    ? data._formValues.map(value => value._formFocus.value)
    : [];
  const inputType = data.valueExpr.values ? "select" : "text";

  return (
    <div>
      <label>{label}</label>
      <ul>
        {values.map((value, i) => (
          <li key={i}>
            {inputType === "text" ? (
              <input type="text" value={value} />
            ) : (
              <select>
                {data.valueExpr.values.map(value => (
                  <option value={value}>{value.split("#")[1]}</option>
                ))}
              </select>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Field;
