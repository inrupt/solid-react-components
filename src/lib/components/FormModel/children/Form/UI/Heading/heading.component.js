import React from 'react';

type Props = {
  content: string
};

const Heading = ({ content }: Props) => <h3>{content}</h3>;

export default Heading;
