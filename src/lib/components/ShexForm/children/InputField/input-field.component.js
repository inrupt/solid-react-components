import React from 'react';
import { ShexConfig } from '@context';
import { DeleteButton } from '..';
import { ErrorMessage, InputWrapper, Input, InputGroup } from './styled.component';

const InputField = ({
  type = 'text',
  valueExpr,
  predicate,
  inputData,
  hasPrefix,
  parentPredicate,
  parentSubject,
  parent,
  canDelete,
  fieldData
}) => {
  const inputName = inputData && inputData.name;
  const defaultValue = fieldData && fieldData._formFocus.value;
  const currentValue = inputData && inputData.value;
  return (
    <ShexConfig.Consumer>
      {({ theme, config: { onChange, onSubmitSave, autoSaveMode, isValueChanged } }) => (
        <InputWrapper
          className={`${theme && theme.inputContainer} ${
            inputData && inputData.error ? 'error' : ''
          }`}
        >
          <InputGroup>
            <Input
              className={theme && theme.input}
              type={type}
              autoComplete="skip"
              value={currentValue}
              name={inputName}
              onChange={onChange}
              data-predicate={predicate}
              data-subject={fieldData && fieldData._formFocus.parentSubject}
              data-default={defaultValue}
              data-prefix={hasPrefix}
              data-parent-predicate={parentPredicate}
              data-valuexpr={JSON.stringify(valueExpr)}
              data-parent-subject={parentSubject}
              data-parent-name={parent && parent._formFocus ? parent._formFocus.name : null}
              onBlur={() =>
                autoSaveMode &&
                isValueChanged(currentValue, defaultValue, inputName) &&
                onSubmitSave(inputName, 'autoSave')
              }
            />
            {!parent && canDelete && (
              <DeleteButton
                {...{
                  predicate,
                  fieldData
                }}
              />
            )}
          </InputGroup>
          {inputData && (inputData.error || inputData.warning) && (
            <ErrorMessage className={theme && theme.inputError}>
              {inputData.error || inputData.warning}
            </ErrorMessage>
          )}
        </InputWrapper>
      )}
    </ShexConfig.Consumer>
  );
};

export default InputField;
