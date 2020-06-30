import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText } from '@testing-library/dom';
import { Comment } from './comment.component';
import 'jest-dom/extend-expect';
import { UI } from '@solid/lit-vocab-common';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<Comment data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the comment', () => {
  const data = {
    [UI.contents]: 'comment'
  };
  const { container } = render(<Comment data={data} />);
  expect(getByText(container, 'comment')).toBeTruthy();
});
