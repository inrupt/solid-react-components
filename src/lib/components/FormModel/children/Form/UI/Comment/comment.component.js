import React from 'react';

type Props = {
  content: string
};

const Comment = ({ content }: Props) => <span>{content}</span>;

export default Comment;
