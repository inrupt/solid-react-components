import React, { Fragment } from "react";

const DropdownFields = ({ shexj, onChange, formValues, parent }) => {
  const { values, _formFocus } = shexj;
  const { name, parentSubject, value } = _formFocus;
  const inputValue = formValues[name] ? formValues[name].value : _formFocus.value;

  return (
    <Fragment>
        <label htmlFor={name}>{parent.predicate.split("#")[1]}</label>
      {values && (
        <select
          value={inputValue}
          onChange={onChange}
          name={name}
          data-subject={parentSubject}
          data-default={value}
          data-predicate={parent.predicate}
        >
          {values.map((item, key) => (
            <option key={key} value={item.value}>
              {item.value}
            </option>
          ))}
        </select>
      )}
    </Fragment>
  );
};

export default DropdownFields;
