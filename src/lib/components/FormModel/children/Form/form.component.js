import React, { useState, useEffect } from 'react';

import { Group } from './form.style';
import ControlGroup from './control-group.component';
import UIMapping from './UI/ui-mapping';
import Multiple from './UI/Multiple';
import DeleteButton from './UI/DeleteButton';

const UI_PARTS = 'ui:parts';

type Props = {
  formModel: Object,
  formObject: Object,
  parent?: any,
  modifyFormObject: () => void,
  deleteField: id => Object,
  addNewField: id => Object,
  children: Node
};

const Form = ({
  formModel,
  modifyFormObject,
  formObject,
  parent,
  deleteField,
  addNewField,
  children
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
          const id = (field && field['ui:name']) || item;

          /**
           * Return null when field doesn't exists
           * this avoid to crash app using recursive component
           */
          if (!field) return null;
          /* eslint no-useless-computed-key: "off" */
          const { ['ui:parts']: deleted, ...udpatedField } = field;

          return fieldParts ? (
            <Form
              key={item}
              formModel={field}
              {...{ formObject, modifyFormObject, parent: udpatedField, deleteField }}
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
              fieldData={{ id, ...field, parent }}
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
