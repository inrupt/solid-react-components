import React from 'react';

type Props = {
  'ui:contents': any
};

const Comment = (props: Props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const contents = props['ui:contents'];
  return <p>{contents}</p>;
};

export default Comment;
