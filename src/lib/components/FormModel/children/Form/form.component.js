import React, { useState, useEffect } from 'react';
import { Group } from './form.style';
import ControlGroup from '../control-group.component';
import UIMapping from './UI/ui-mapping';
import Multiple from './UI/Multiple';
import DeleteButton from './UI/DeleteButton';

const UI_PARTS = 'ui:parts';

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
  return formModel['rdf:type'] && formModel['rdf:type'].includes('Multiple') ? (
    <p>{formModel['ui:label']}</p>
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
  onSave,
  settings
}: Props) => {
  const [formFields, setFormFields] = useState([]);
  const parts = formModel[UI_PARTS];
  const getArrayFields = () => {
    if (typeof formModel === 'object' && parts) {
      setFormFields(Object.keys(parts));
    }
  };

  useEffect(() => {
    getArrayFields();
  }, [formModel]);
  const classes = `${
    parent && settings.theme && settings.theme.childGroup ? settings.theme.childGroup : ''
  } ${settings.theme && settings.theme.form ? settings.theme.form : ''}`;
  return (
    <Group className={classes} parent={parent}>
      {formModel['dc:title'] && <h2>{formModel['dc:title']}</h2>}
      <ParentLabel formModel={formModel} />
      {formFields.length > 0 &&
        formFields.map(item => {
          const field = parts[item];
          const fieldParts = field && field[UI_PARTS];
          const component = field && UIMapping(field['rdf:type']);
          const id = (field && field['ui:name']) || item;
          /**
           * Return null when field doesn't exists
           * this avoid to crash app using recursive component
           */
          if (!field) return null;
          /* eslint no-useless-computed-key: "off" */
          const { ['ui:parts']: deleted, ...updatedField } = field;

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
                autoSave,
                settings
              }}
            >
              <Multiple
                {...{
                  field,
                  addNewField,
                  className: settings.theme && settings.theme.multiple
                }}
              />
              <DeleteButton
                {...{
                  type: field['rdf:type'],
                  action: deleteField,
                  id: field['ui:name'],
                  className: settings.theme && settings.theme.deleteButton
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
