import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import { Email } from './email.component';
import 'jest-dom/extend-expect';
import { UI } from '@solid/lit-vocab-common';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<Email data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.label]: 'email label'
  };
  const { container } = render(<Email data={data} />);
  expect(getByText(container, 'email label')).toBeTruthy();
});

test('Renders the email address', () => {
  const data = {
    [UI.label]: 'email label',
    [UI.value]: 'test@email.com'
  };
  const { container } = render(<Email id="testid" data={data} />);
  expect(getByLabelText(container, 'email label').value).toBe('test@email.com');
});
