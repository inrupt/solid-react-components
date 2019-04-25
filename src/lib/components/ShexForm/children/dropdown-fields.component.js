import React, { Fragment } from "react";
import { shexFormLabel, shexParentLinkOnDropDowns } from "@utils";

type Props = {
  formValues: Object
};

const DropdownFields = ({ shexj, onChange, formValues, parent }: Props) => {
  const { values, _formFocus } = shexj;
  const { name, parentSubject, value } = _formFocus;
  const inputValue = formValues[name]
    ? formValues[name].value
    : _formFocus.value;

  const label = shexFormLabel(parent);

  return (
    <Fragment>
      <label htmlFor={name}>{label}</label>
      {values && (
        <select
          value={inputValue}
          onChange={onChange}
          name={name}
          data-subject={parentSubject}
          data-default={value}
          data-predicate={parent.predicate}
          data-parent-predicate={shexParentLinkOnDropDowns(parent)}
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
