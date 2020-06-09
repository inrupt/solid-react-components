import React, { useContext, useEffect, useState } from 'react';
import { RDF, UI, DCTERMS } from '@inrupt/lit-generated-vocab-common';
import { ThemeContext } from '@context';
import UIMapping from './UI/ui-mapping';
import { Group } from './viewer.style';
import { MultipleViewer } from './UI/MultipleViewer/multiple-viewer.component';

type Props = {
  formModel: Object,
  parent?: any
};

const Viewer = (props: Props) => {
  const { theme } = useContext(ThemeContext);
  const { formModel, parent } = props;
  const [formFields, setFormFields] = useState([]);
  const partsKey = UI.parts.iriAsString;
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
    <Group parent={parent} className={theme && theme.groupField}>
      {formModel[DCTERMS.title] && <h2>{formModel[DCTERMS.title]}</h2>}
      {formFields.length > 0 &&
        formFields.map(item => {
          // Grabs the field from the parent list of parts, and checks if we have parts in the new field as well
          const field = parts[item];
          const type = field[RDF.type];

          // Fetch the component from the Viewer-specific mapper
          const Component = field && UIMapping(type);
          const id = (field && field[UI.name]) || item;

          /**
           * Return null when field doesn't exists
           * this avoid to crash app using recursive component
           */
          if (!field) return null;

          /* eslint no-useless-computed-key: "off" */
          const { [UI.parts]: deleted, ...updatedField } = field;

          return (
            <div>
              {type === UI.Group.iriAsString && (
                <Viewer
                  {...{
                    key: item,
                    formModel: field,
                    parent: updatedField
                  }}
                />
              )}
              {type === UI.Multiple.iriAsString && (
                <MultipleViewer
                  {...{
                    key: item,
                    formModel: field,
                    parent: updatedField
                  }}
                />
              )}
              {type !== UI.Group.iriAsString && type !== UI.Multiple.iriAsString && (
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
