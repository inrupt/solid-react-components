import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import { Phone } from './phone.component';
import { UI } from '@constants';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<Phone data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.LABEL]: 'Phone label'
  };
  const { container } = render(<Phone data={data} />);
  expect(getByText(container, 'Phone label')).toBeTruthy();
});

test('Renders the Phone address', () => {
  const data = {
    [UI.LABEL]: 'Phone label',
    [UI.VALUE]: '(555) 555-5555'
  };
  const { container } = render(<Phone id="testid" data={data} />);
  expect(getByLabelText(container, 'Phone label').value).toBe('(555) 555-5555');
});
