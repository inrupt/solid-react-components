import React, { useContext } from 'react';

import { ThemeContext } from '@context';
import { Group } from '../Group';
import { DeleteButton } from '../Form/UI/DeleteButton/delete-button.component';
import { UI } from '@inrupt/lit-generated-vocab-common';

type Props = {
  id: string,
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

export const Multiple = (props: Props) => {
  const { id, data, updateData, mapper, savingData, addNewField, deleteField } = props;
  const { theme } = useContext(ThemeContext);
  const { [UI.label.value]: label, [UI.part.value]: part } = data;

  const parts = [];

  // Get list of parts for the
  if (part) {
    Object.keys(part).forEach(item => {
      parts.push(part[item]);
    });
  }

  return (
    <div id={id} className={theme && theme.multipleField} key={id}>
      <p>{label}</p>
      {parts.map(item => {
        // Fetch the name from the object for a unique key
        const key = item[UI.name.value];
        const type = UI.Group.value;

        // For now we only support Multiples containing Groups. Once that restriction goes away we need more checks
        // to see if the type is a part or another Component. This groupParts is a temporary fix until we add support
        // for more Component types in Multiples
        const groupPartsKey = Object.keys(item[UI.parts.value])[0];
        const groupParts = item[UI.parts.value][groupPartsKey][UI.parts.value];

        // If the group doesn't contain parts, exit gracefully. This shouldn't get hit with a valid form model.
        if (!groupParts) {
          return <div />;
        }
        return (
          <div key={key}>
            <Group
              {...{
                data: groupParts,
                updateData,
                mapper,
                savingData
              }}
            />
            <DeleteButton
              {...{
                type,
                action: deleteField,
                id: key,
                className: theme && theme.deleteButton
              }}
            />
          </div>
        );
      })}

      <button type="button" onClick={() => addNewField(id)} className={theme && theme.multiple}>
        Add new field
      </button>
    </div>
  );
};
