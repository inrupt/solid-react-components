import React, { useContext } from 'react';

import { UI } from '@inrupt/lit-generated-vocab-common';

export const Heading = props => {
  const { data } = props;

  return <h3>{data[UI.contents.value]}</h3>;
};
