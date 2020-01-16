import React, { useContext } from 'react';

import { ThemeContext } from '@context';
import { UI, VOCAB } from '@constants';
import { Group } from '../Group';
import { DeleteButton } from '../Form/UI/DeleteButton/delete-button.component';

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
  const { [UI.LABEL]: label, [UI.PART]: part } = data;

  const parts = [];

  // Get list of parts for the
  Object.keys(part).forEach(item => {
    parts.push(part[item]);
  });

  // Quick and dirty setup of custom classes.
  // TODO: Refactor this
  let classes = '';
  if (theme) {
    if (theme.form) {
      classes += theme.form;
    }
    if (theme.childGroup) {
      if (classes.length > 0) {
        classes += ' ';
      }
      classes += theme.childGroup;
    }
  }

  return (
    <div id={id} className={classes} key={id}>
      <p>{label}</p>
      {parts.map(item => {
        // Fetch the name from the object for a unique key
        const key = item[UI.NAME];
        const type = VOCAB.UI.Group;
        return (
          <div key={key}>
            <Group
              className={theme && theme.childGroup}
              {...{
                data: item[UI.PARTS],
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
