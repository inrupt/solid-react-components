import React, { useContext } from 'react';

import { ThemeContext } from '@context';
import { UI, RDF } from '@constants';
import { Group } from '../Group';

type Props = {
  id: string,
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

export const Multiple = (props: Props) => {
  const { id, data, updateData, mapper, savingData } = props;
  const { theme } = useContext(ThemeContext);
  /**
   * A multiple should **not** have a 'parts' predicate, however the current implementation
   * links the data in it.
   */
  const {
    [UI.LABEL]: label,
    [data[RDF.TYPE].includes('Group') ? UI.PARTS : UI.PART]: parts
  } = data;

  /**
   * TODO: check if this is the right behaviour for when the pod does not have data
   */
  if (!parts) {
    const { [UI.PART]: part } = data;
    const { [RDF.TYPE]: partType } = part;
    const Component = mapper[partType];

    if (!Component) return null;

    return (
      <div>
        <Component data={part} updateData={updateData} mapper={mapper} savingData={savingData} />
      </div>
    );
  } // TODO: should render the single 'ui:part'?

  return (
    <div id={id} className={theme.multiple}>
      <p>{label}</p>
      <Group
        {...{
          data: parts,
          updateData,
          mapper,
          savingData
        }}
      />
    </div>
  );
};
