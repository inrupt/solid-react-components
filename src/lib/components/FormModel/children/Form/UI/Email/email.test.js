import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import { Email } from './email.component';
import { UI } from '@constants';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<Email data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.LABEL]: 'email label'
  };
  const { container } = render(<Email data={data} />);
  expect(getByText(container, 'email label')).toBeTruthy();
});

test('Renders the email address', () => {
  const data = {
    [UI.LABEL]: 'email label',
    [UI.VALUE]: 'test@email.com'
  };
  const { container } = render(<Email id="testid" data={data} />);
  expect(getByLabelText(container, 'email label').value).toBe('test@email.com');
});
