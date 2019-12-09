import React, { useState, useEffect, useContext } from 'react';

import { FormModelUI, CORE_ELEMENTS } from '@constants';
import { FormModelConfig } from '@context';

import { Group } from './form.style';
import ControlGroup from '../control-group.component';
import UIMapping from './UI/ui-mapping';
import Multiple from './UI/Multiple';
import DeleteButton from './UI/DeleteButton';

const { UI_PARTS, RDF_TYPE, UI_LABEL, UI_NAME } = FormModelUI;
const { TITLE } = CORE_ELEMENTS;

type Props = {
  formModel: Object,
  formObject: Object,
  parent?: any,
  modifyFormObject: () => void,
  onSave: () => void,
  deleteField: id => Object,
  addNewField: id => Object,
  children: Node,
  autoSave: boolean,
  settings: Object
};

const ParentLabel = ({ formModel }: Props.formModel) => {
  // TODO: check for the explicit 'multiple' object instead of using includes.
  return formModel[RDF_TYPE] && formModel[RDF_TYPE].includes('Multiple') ? (
    <p>{formModel[UI_LABEL]}</p>
  ) : null;
};

const Form = ({
  formModel,
  modifyFormObject,
  formObject,
  parent,
  deleteField,
  addNewField,
  autoSave,
  children,
  onSave
}: Props) => {
  const [formFields, setFormFields] = useState([]);
  const { theme, savingComponent } = useContext(FormModelConfig);

  const parts = formModel[UI_PARTS];

  /* keep our data in sync with the form model */
  useEffect(() => {
    if (typeof formModel === 'object' && parts) setFormFields(Object.keys(parts));
  }, [formModel]);

  // TODO: expand and document this.
  const classes = `${parent && theme && theme.childGroup ? theme.childGroup : ''} ${
    theme && theme.form ? theme.form : ''
  }`;

  return (
    <Group className={classes} parent={parent}>
      {formModel[TITLE] && <h2>{formModel[TITLE]}</h2>}
      <ParentLabel formModel={formModel} />
      {formFields.length > 0 &&
        formFields.map(item => {
          const field = parts[item];
          const fieldParts = field && field[UI_PARTS];
          const component = field && UIMapping(field[RDF_TYPE]);
          const id = (field && field[UI_NAME]) || item;
          /**
           * Return null when field doesn't exists
           * this avoid to crash app using recursive component
           */
          if (!field) return null;
          /* eslint no-useless-computed-key: "off" */
          const { [UI_PARTS]: deleted, ...updatedField } = field;

          return fieldParts ? (
            <Form
              key={item}
              formModel={field}
              {...{
                formObject,
                modifyFormObject,
                parent: updatedField,
                deleteField,
                onSave,
                autoSave
              }}
            >
              <Multiple
                {...{
                  field,
                  addNewField,
                  className: theme && theme.multiple
                }}
              />
              <DeleteButton
                {...{
                  type: field['rdf:type'],
                  action: deleteField,
                  id: field['ui:name'],
                  className: theme && theme.deleteButton
                }}
              />
            </Form>
          ) : (
            <ControlGroup
              key={item}
              component={component}
              value={field['ui:value']}
              fieldData={{ id, ...field, parent }}
              modifyFormObject={modifyFormObject}
              formObject={formObject}
              autoSave={autoSave}
              onSave={onSave}
              savingComponent={savingComponent}
            />
          );
        })}
      {children}
    </Group>
  );
};

Form.defaultProps = {
  parent: null
};

export default Form;
