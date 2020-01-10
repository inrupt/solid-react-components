import React, { useContext } from 'react';

import { ThemeContext } from '@context';
import { UI, VOCAB } from '@constants';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void,
  mapper: object
};

export const Multiple = (props: Props) => {
  const { id, data, updateData, mapper } = props;
  const { theme } = useContext(ThemeContext);

  /**
   * A multiple should **not** have a 'parts' predicate, however the current implementation
   * links the data in it.
   */
  const { [UI.LABEL]: label, [UI.PARTS]: parts } = data;

  /**
   * TODO: check if this is the right behaviour for when the pod does not have data
   */

  if (!parts) return <p>There are not parts in the multiple!</p>; // TODO: should render the single 'ui:part'

  return (
    <div id={id} className={theme.multiple}>
      <p>{label}</p>
      {}
    </div>
  );
};
