import React from 'react';

type Props = {
  action: id => void,
  id: string,
  text: string
};

export const DeleteButton = ({ action, text = 'Delete', type, id }: Props) =>
  type.includes('Group') && (
    <button type="button" onClick={() => action(id)}>
      {text}
    </button>
  );
