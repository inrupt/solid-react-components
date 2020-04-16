import React, { useContext } from 'react';

import { UI } from '@constants';
import { DataContext, ThemeContext } from '@context';

export const Heading = props => {
  const { data } = props;

  return <h3>{data[UI.CONTENTS]}</h3>;
};
