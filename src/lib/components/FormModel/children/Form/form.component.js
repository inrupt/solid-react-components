import React, { useState, useEffect } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { FormModel } from 'solid-forms';

import { FORM_MODEL } from '@constants';
import { Group } from './form.style';
import ControlGroup from './control-group.component';
import UIMapping from './UI/ui-mapping';

const UI_PARTS = 'ui:parts';

const Form = ({ formModel, formActions, formObject, setFormObject }) => {
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
          const fieldParts = field[UI_PARTS];
          const component = UIMapping(field['rdf:type']);
          const id = field.name || item;
          return fieldParts ? (
            <Form key={item} formModel={field} {...{ formActions, formObject, setFormObject }} />
          ) : (
            <ControlGroup
              key={item}
              component={component}
              fieldData={{ id, ...field }}
              retrieveNewFormObject={formActions.retrieveNewFormObject}
              formObject={formObject}
              setFormObject={setFormObject}
            />
          );
        })}
    </Group>
  );
};

export default Form;
