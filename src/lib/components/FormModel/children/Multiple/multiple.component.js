import React from 'react';

import { UI, VOCAB } from '@constants';

type Props = {
  id: string,
  data: object,
  updateData: (string, string) => void,
  mapper: object
};

export const Multiple = (props: Props) => {
  const { id, data, updateData, mapper } = props;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
