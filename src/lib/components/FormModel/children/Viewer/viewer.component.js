import React, { useEffect, useState } from 'react';
import ControlGroup from '../control-group.component';
import UIMapping from './UI/ui-mapping';
import { Group, Label } from './viewer.style';

const UI_PARTS = 'ui:parts';

type Props = {
  formModel: Object,
  parent?: any
};

const ParentLabel = ({ formModel }: { formModel: Object }) =>
  formModel['rdf:type'] && formModel['rdf:type'].includes('Multiple') ? (
    <Label>{formModel['ui:label']}</Label>
  ) : null;

const Viewer = ({ formModel, parent }: Props) => {
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
    <Group parent={parent}>
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
            <Viewer
              {...{
                key: item,
                formModel: field,
                parent: updatedField
              }}
            />
          ) : (
            <ControlGroup
              key={item}
              component={component}
              value={field['ui:value']}
              fieldData={{ id, ...field, parent }}
            />
          );
        })}
    </Group>
  );
};

Viewer.defaultProps = {
  parent: null
};

export default Viewer;
