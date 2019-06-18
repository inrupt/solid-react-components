/* eslint-disable jsx-a11y/label-has-for */
import React, { Fragment } from 'react';
import { shexUtil } from '@utils';
import { ShexConfig } from '@context';
import { InputField, DropDownField } from '..';

type FieldProps = {
  data: Object,
  inputData: Object
};

const Field = ({ data, fieldData, inputData, canDelete, parent }: FieldProps) => {
  const inputType = data.valueExpr.values ? 'select' : 'text';
  const { predicate } = data;
  const annotation = shexUtil.findAnnotation('layoutprefix', data.annotations);
  const hasPrefix = annotation && annotation.object.value;
  const parentPredicate = parent && parent.predicate ? parent.predicate : null;
  const parentSubject = parent && parent._formFocus.parentSubject;
  return (
    <ShexConfig.Consumer>
      {({ languageTheme: { language } }) => (
        <Fragment>
          <label htmlFor={inputData.name}>{shexUtil.formLabel(data, language)}</label>
          {inputType === 'text' ? (
            <InputField
              {...{
                type: 'text',
                fieldData,
                inputData,
                predicate,
                hasPrefix,
                parent,
                parentPredicate,
                parentSubject,
                canDelete,
                valueExpr: data.valueExpr,
                error: data.error || data.warning,
                id: inputData.name
              }}
            />
          ) : (
            <DropDownField
              {...{
                fieldData,
                canDelete,
                predicate,
                hasPrefix,
                parent,
                parentPredicate,
                value: inputData.value,
                disabled: inputData.disabled,
                defaultValue: fieldData._formFocus.value,
                subject: fieldData._formFocus.parentSubject,
                name: inputData.name,
                values: data.valueExpr.values,
                error: inputData && inputData.error,
                id: inputData.name
              }}
            />
          )}
        </Fragment>
      )}
    </ShexConfig.Consumer>
  );
};

export default Field;
