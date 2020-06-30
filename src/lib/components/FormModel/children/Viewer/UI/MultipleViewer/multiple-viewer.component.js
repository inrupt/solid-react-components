import React, { useContext } from 'react';
import { UI } from '@solid/lit-vocab-common';
import { ThemeContext } from '@context';
import Viewer from '../../viewer.component';

type Props = {
  key: string,
  formModel: object,
  parent: object
};

export const MultipleViewer = (props: Props) => {
  const { key, formModel, parent } = props;
  const { theme } = useContext(ThemeContext);
  const { [UI.label]: label, [UI.part]: part } = formModel;
  const parts = [];

  // Get list of parts for the
  if (part) {
    Object.keys(part).forEach(item => {
      parts.push(part[item]);
    });
  }

  return (
    <div id={key} className={theme && theme.multipleField} key={key}>
      <p>{label}</p>
      {parts.map(item => {
        // Fetch the name from the object for a unique key
        const key = item[UI.name];
        return (
          <div key={key}>
            <Viewer
              {...{
                formModel: item[UI.parts][Object.keys(item[UI.parts])[0]],
                parent
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
