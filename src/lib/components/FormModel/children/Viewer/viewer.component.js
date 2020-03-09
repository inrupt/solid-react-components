import React, { useContext, useEffect, useState } from 'react';
import UIMapping from './UI/ui-mapping';
import { Group } from './viewer.style';
import { UI, VOCAB } from '@constants';
import { ThemeContext } from '@context';
import { MultipleViewer } from './UI/MultipleViewer/multiple-viewer.component';

type Props = {
  formModel: Object,
  parent?: any
};

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
    <Group parent={parent} className={formModel[UI.PART] && theme && theme.childGroup}>
      {formModel['dc:title'] && <h2>{formModel['dc:title']}</h2>}
      {formFields.length > 0 &&
        formFields.map(item => {
          // Grabs the field from the parent list of parts, and checks if we have parts in the new field as well
          const field = parts[item];
          const type = field['rdf:type'];

          // Fetch the component from the Viewer-specific mapper
          const Component = field && UIMapping(type);
          const id = (field && field[UI.NAME]) || item;

          /**
           * Return null when field doesn't exists
           * this avoid to crash app using recursive component
           */
          if (!field) return null;
          /* eslint no-useless-computed-key: "off" */
          const { ['ui:parts']: deleted, ...updatedField } = field;

          return (
            <div>
              {type === VOCAB.UI.Group && (
                <Viewer
                  {...{
                    key: item,
                    formModel: field,
                    parent: updatedField
                  }}
                />
              )}
              {type === VOCAB.UI.Multiple && (
                <MultipleViewer
                  {...{
                    key: item,
                    formModel: field,
                    parent: updatedField
                  }}
                />
              )}
              {type !== VOCAB.UI.Group && type !== VOCAB.UI.Multiple && (
                <Component
                  {...{
                    key: id,
                    name: id,
                    formModel: field,
                    parent: updatedField,
                    data: field
                  }}
                />
              )}
            </div>
          );
        })}
    </Group>
  );
};

Viewer.defaultProps = {
  parent: null
};

export default Viewer;
