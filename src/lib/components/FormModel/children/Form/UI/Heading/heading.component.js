import React, { useContext } from 'react';

import { UI } from '@solid/lit-vocab-common';

export const Heading = props => {
  const { data } = props;

  return <h3>{data[UI.contents]}</h3>;
};
