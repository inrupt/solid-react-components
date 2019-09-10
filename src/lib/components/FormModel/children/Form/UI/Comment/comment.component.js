import React from 'react';

const Comment = props => {
  // eslint-disable-next-line react/destructuring-assignment
  const contents = props['ui:contents'];
  return <h2>{contents}</h2>;
};

export default Comment;
