import React from 'react';

type Props = {
  id: String,
  modifyFormObject: () => void,
  formObject: Object,
  autoSaveMode: boolean,
  onSubmitSave: () => void,
  onBlur: () => void,
  predicate: String,
  isValueChanged: boolean,
  inputData: Object,
  fieldData: Object,
  parentPredicate: String,
  parent: any,
  parentSubject: String,
  valueExpr: String,
  value: String,
  rest: any
};

const TextArea = ({
  id,
  modifyFormObject,
  formObject,
  autoSaveMode,
  predicate,
  onSubmitSave,
  onBlur,
  isValueChanged,
  inputData,
  fieldData,
  parentPredicate,
  parent,
  parentSubject,
  valueExpr,
  value,
  ...rest
}: Props) => {
  const name = '';
  const inputName = inputData && inputData.name;
  const defaultValue = fieldData && fieldData._formFocus.value;
  const currentValue = inputData && inputData.value;
  const disabled = inputData && inputData.disabled;

  const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;
  const onChange = ({ target }) => {
    value = target.value;
    const obj = { value: target.value, ...rest };
    modifyFormObject(id, obj);
  };
  return (
    <label htmlFor={name}>
      <textarea
        id={name}
        value={value}
        onChange={onChange}
        disable={disabled}
        data-predicate={predicate}
        data-subject={fieldData && fieldData._formFocus.parentSubject}
        data-default={defaultValue}
        data-parent-predicate={parentPredicate}
        data-valuexpr={JSON.stringify(valueExpr)}
        data-parent-subject={parentSubject}
        data-parent-name={parent && parent._formFocus ? parent._formFocus.name : null}
        onBlur={onBlur}
      />
    </label>
  );
};

export default TextArea;
