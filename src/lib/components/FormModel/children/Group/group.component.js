import React, { useContext } from 'react';
import { ThemeContext } from '@context';
import { RDF, UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

type Props = {
  data: object,
  updateData: (string, string) => void,
  mapper: object,
  addNewField: string => void,
  deleteField: string => void,
  savingData: {
    autosaveIndicator: React.Component,
    running: boolean,
    names: Array<string>,
    error: boolean
  }
};

export const Group = (props: Props) => {
  const { data, updateData, mapper, savingData, addNewField, deleteField } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme && theme.groupField}>
      {Object.entries(data).map(([, part]) => {
        const { [RDF.type.value]: type, [UI.name.value]: name } = part;
        const Component = mapper[type];

        if (!Component) return null;

        /* if this component is being saved right now */
        const savingThis = savingData.names.some((componentName: string) => name === componentName);
        const componentData = type === UI.Group.value ? part[UI.parts.value] : part;

        let Indicator = () => null;
        if (savingData && savingThis) Indicator = savingData.autosaveIndicator;

        return (
          <div key={name}>
            <Component
              {...{
                key: name,
                id: name,
                data: componentData,
                updateData,
                addNewField,
                deleteField,
                mapper,
                savingData
              }}
            />
            <Indicator {...{ errored: savingData.error, running: savingData.running }} />
          </div>
        );
      })}
    </div>
  );
};
