import React, { useState, useEffect } from 'react';

import { Group } from './form.style';
import ControlGroup from './control-group.component';
import UIMapping from './UI/ui-mapping';
import Multiple from './UI/Multiple';
import DeleteButton from './UI/DeleteButton';

const UI_PARTS = 'ui:parts';

const Form = ({
  formModel,
  modifyFormObject,
  formObject,
  parent,
  deleteField,
  addNewField,
  children
}) => {
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
              {...{ formObject, modifyFormObject, parent: formModel, deleteField }}
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
              value={field['ui:value']}
              fieldData={{ id, ...field, ...parent }}
              modifyFormObject={modifyFormObject}
              formObject={formObject}
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
