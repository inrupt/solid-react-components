import React from 'react';

type Props = {
  action: id => void,
  id: string,
  text: string,
  className: string
};

export const DeleteButton = ({ action, text = 'Delete', type, id, className }: Props) =>
  type.includes('Group') && (
    <button type="button" onClick={() => action(id)} className={className}>
      {text}
    </button>
  );
