import React from 'react';

type Props = {
  content: string
};

const Heading = ({ content }: Props) => <h2>{content}</h2>;

export default Heading;
