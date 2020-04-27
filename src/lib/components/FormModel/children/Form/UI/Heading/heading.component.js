import React, { useContext } from 'react';

import { UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

export const Heading = props => {
  const { data } = props;

  return <h3>{data[UI.contents.value]}</h3>;
};
