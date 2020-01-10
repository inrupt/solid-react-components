import React, { useState, useEffect, useContext } from 'react';

import { ThemeContext } from '@context';

type Props = {
  errored: boolean,
  running: boolean
};

export const Spinner = (props: Props) => {
  const { errored, running } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <span className={theme.spinner}>
      {running ? <span>Saving...</span> : null}
      {errored ? <span>{Error}</span> : null}
    </span>
  );
};
