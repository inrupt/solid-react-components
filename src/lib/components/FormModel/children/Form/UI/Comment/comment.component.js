import React from 'react';

type Props = {
  'ui:contents': any
};

const Comment = (props: Props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const contents = props['ui:contents'];
  return <h2>{contents}</h2>;
};

export default Comment;
