import React from 'react';
import { shexUtil } from '@utils';
import { ShexConfig } from '@context';
import { Panel } from './styled.component';
import { DeleteButton, AddButton, DropDownField, ExpressionFields } from './children';

type ShexFormProps = {
  shexj: Object,
  parent: Object | null,
  formValues: Object,
  addNewExpression: Function
};

const ShexForm = ({ shexj, parent = null, formValues }: ShexFormProps) => {
  const { expression } = shexj;

  return shexj ? (
    <ShexConfig.Consumer>
      {({ theme, languageTheme: { language } }) => (
        <Panel
          className={`${
            // eslint-disable-next-line no-nested-ternary
            theme ? (parent ? theme.shexPanel : theme.shexRoot) : ''
          }`}
        >
          {parent && shexUtil.canDelete(parent) && (
            <DeleteButton
              {...{
                parent,
                fieldData: shexj,
                floating: true,
                canDelete: shexUtil.canDelete(parent)
              }}
            />
          )}

          {expression && expression.expressions && expression.expressions.length > 0
            ? expression.expressions.map((expression, i) => {
                if (typeof expression.valueExpr === 'string') {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <React.Fragment key={i}>
                      <h4>{shexUtil.formLabel(expression, language)}</h4>
                      {expression._formValues.map((shexj, i) => (
                        <ShexForm
                          {...{
                            key: i,
                            parent: {
                              ...expression,
                              _formFocus: shexj._formFocus
                            },
                            shexj,
                            formValues
                          }}
                        />
                      ))}
                      <AddButton
                        {...{
                          allowNewFields: shexUtil.allowNewFields(expression),
                          defaultExpression: expression
                        }}
                      />
                    </React.Fragment>
                  );
                }
                return (
                  <ExpressionFields
                    {...{
                      data: expression,
                      key: i,
                      formValues,
                      parent,
                      parentName: shexj._formFocus ? shexj._formFocus.name : null
                    }}
                  />
                );
              })
            : shexj._formFocus && (
                // eslint-disable-next-line react/jsx-indent
                <DropDownField
                  {...{
                    values: shexj.values,
                    value: formValues[shexj._formFocus.name]
                      ? formValues[shexj._formFocus.name].value
                      : shexj._formFocus.value,
                    fieldData: formValues[shexj] ? formValues[shexj] : shexj,
                    defaultValue: shexj._formFocus.value,
                    subject: shexj._formFocus.parentSubject,
                    name: shexj._formFocus.name,
                    label: shexUtil.formLabel(parent),
                    canDelete: shexUtil.canDelete(parent),
                    predicate: parent.predicate,
                    parent,
                    parentPredicate: shexUtil.parentLinkOnDropDowns(parent),
                    parentSubject: shexj._formFocus.parentSubject,
                    error: formValues[shexj._formFocus.name]
                      ? formValues[shexj._formFocus.name].error
                      : null
                  }}
                />
              )}
        </Panel>
      )}
    </ShexConfig.Consumer>
  ) : null;
};

export default ShexForm;
