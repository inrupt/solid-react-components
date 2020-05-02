import React, { useContext } from 'react';

import { ThemeContext } from '@context';
import { UI } from '@inrupt/lit-generated-vocab-common';

type Props = {
  data: object
};

export const Comment = (props: Props) => {
  const { data } = props;
  const { [UI.contents.value]: comment } = data;

  const { theme } = useContext(ThemeContext);

  return <p className={theme.comment}>{comment}</p>;
};
