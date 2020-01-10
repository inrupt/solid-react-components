import React, { useContext } from 'react';

import { UI, RDF } from '@constants';
import { ThemeContext } from '@context';

type Props = {
  data: object,
  updateData: (string, string) => void,
  mapper: object,
  savingData: {
    autosaveIndicator: React.Component,
    running: boolean,
    names: Array<string>,
    error: boolean
  }
};

export const Group = (props: Props) => {
  const { data, updateData, mapper, savingData } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme.group}>
      {Object.entries(data).map(([, part]) => {
        const { [RDF.TYPE]: type, [UI.NAME]: name } = part;
        const Component = mapper[type];

        if (!Component) return null;

        /* if this component is being saved right now */
        const savingThis = savingData.names.some((componentName: string) => name === componentName);

        let Indicator = () => null;
        if (savingData.running && savingThis) Indicator = savingData.autosaveIndicator;

        return (
          <div className={theme.savingGroup}>
            <Component
              {...{
                key: name,
                id: name,
                data: part,
                updateData,
                mapper
              }}
            />
            <Indicator {...{ errored: savingData.error, running: savingData.running }} />
          </div>
        );
      })}
    </div>
  );
};
