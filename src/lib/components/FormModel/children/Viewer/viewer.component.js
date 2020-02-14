import React, { useContext, useEffect, useState } from 'react';
import UIMapping from './UI/ui-mapping';
import { Group, Label } from './viewer.style';
import { UI, VOCAB } from '@constants';
import { ThemeContext } from '@context';

type Props = {
  formModel: Object,
  parent?: any
};

const ParentLabel = ({ formModel }: { formModel: Object }) =>
  formModel['rdf:type'] && formModel['rdf:type'].includes('Multiple') ? (
    <Label>{formModel['ui:label']}</Label>
  ) : null;

const Viewer = (props: Props) => {
  const { theme } = useContext(ThemeContext);
  const { formModel, parent } = props;
  const [formFields, setFormFields] = useState([]);
  const partsKey = UI.PARTS;
  const parts = formModel[partsKey];

  const getArrayFields = () => {
    if (typeof formModel === 'object' && parts) {
      setFormFields(Object.keys(parts));
    }
  };

  useEffect(() => {
    getArrayFields();
  }, [formModel]);

  return (
    <Group parent={parent} className={parent && theme && theme.childGroup}>
      {formModel['dc:title'] && <h2>{formModel['dc:title']}</h2>}
      <ParentLabel formModel={formModel} />
      {formFields.length > 0 &&
        formFields.map(item => {
          // Grabs the field from the parent list of parts, and checks if we have parts in the new field as well
          const field = parts[item];
          let fieldParts = field[UI.PARTS];

          const type = field['rdf:type'];

          // Fetch the component from the Viewer-specific mapper
          const Component = field && UIMapping(type);
          const id = (field && field['ui:name']) || item;
          let componentData = field;

          // If we have a group or mutliple, instead of sending the field we send the list of parts (or part)
          if (type === VOCAB.UI.GROUP) {
            componentData = field[UI.PARTS];
          } else if (type === VOCAB.UI.Multiple) {
            componentData = field[UI.PARTS];
            fieldParts = field[UI.PARTS];
          }

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
            <Component
              {...{
                key: id,
                name: id,
                formModel: field,
                parent: updatedField,
                data: componentData
              }}
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
