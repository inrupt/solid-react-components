import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText } from '@testing-library/dom';
import { DeleteButton } from './delete-button.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const props = {
    type: 'Group'
  };
  const { container } = render(<DeleteButton {...props} />);
  expect(getByText(container, 'Delete')).toBeTruthy();
  expect(container).toBeTruthy();
});

test('Renders the text', () => {
  const props = {
    type: 'Group',
    text: 'Button Text'
  };
  const { container } = render(<DeleteButton {...props} />);
  expect(getByText(container, 'Button Text')).toBeTruthy();
});
