import React from 'react';

type Props = {
  'ui:contents': any
};

const Heading = (props: Props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const contents = props['ui:contents'];
  return <h3>{contents}</h3>;
};

export default Heading;
