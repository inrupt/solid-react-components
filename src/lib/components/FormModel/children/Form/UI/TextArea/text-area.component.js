import React from 'react';
import { FormModelConfig } from '@context';

import { TextAreaGroup } from './text-area.styles';

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
  const label = rest['ui:label'] || '';
  const name = rest['ui:name'] || '';
  const maxLength = rest['ui:maxLength'] || 10000;
  const defaultValue = fieldData && fieldData._formFocus.value;
  const disabled = inputData && inputData.disabled;

  const actualValue = formObject[id] || formObject[id] === '' ? formObject[id].value : value;
  const onChange = ({ target }) => {
    const obj = { value: target.value, ...rest };
    modifyFormObject(id, obj);
  };
  return (
    <FormModelConfig.Consumer>
      {({ theme }) => (
        <TextAreaGroup className={theme && theme.inputTextArea}>
          <label htmlFor={name}>
            {label}
            <textarea
              id={name}
              name={name}
              value={actualValue}
              onChange={onChange}
              disabled={disabled}
              maxLength={maxLength}
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
        </TextAreaGroup>
      )}
    </FormModelConfig.Consumer>
  );
};

export default TextArea;
