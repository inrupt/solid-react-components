import React, { useState, useEffect } from 'react';

import { Group } from './form.style';
import ControlGroup from './control-group.component';
import UIMapping from './UI/ui-mapping';
import Multiple from './UI/Multiple';
import DeleteButton from './UI/DeleteButton';

const UI_PARTS = 'ui:parts';

type Props = {
  formModel: Object,
  formActions: Object,
  formObject: Object,
  children: Node,
  addNewField: id => Object,
  deleteField: id => Object,
  setFormObject: id => void
};

const Form = ({
  formModel,
  formActions,
  formObject,
  setFormObject,
  children,
  addNewField,
  deleteField
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

  return (
    <Group>
      {formModel['dc:title'] && <h2>{formModel['dc:title']}</h2>}
      {formFields.length > 0 &&
        formFields.map(item => {
          const field = parts[item];
          const fieldParts = field && field[UI_PARTS];
          const component = field && UIMapping(field['rdf:type']);
          const id = (field && field.name) || item;

          /**
           * Return null when field doesn't exists
           * this avoid to crash app using recursive component
           */
          if (!field) return null;

          return fieldParts ? (
            <Form
              key={item}
              formModel={field}
              {...{ formActions, formObject, setFormObject, deleteField }}
            >
              <Multiple {...{ field, addNewField }} />
              <DeleteButton
                {...{ type: field['rdf:type'], action: deleteField, id: field['ui:name'] }}
              />
            </Form>
          ) : (
            <ControlGroup
              key={item}
              component={component}
              fieldData={{ id, ...field }}
              retrievenewformobject={formActions.retrieveNewFormObject}
              formobject={formObject}
              setformobject={setFormObject}
            />
          );
        })}
      {children}
    </Group>
  );
};

export default Form;
