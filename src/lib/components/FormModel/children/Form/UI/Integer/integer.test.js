import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import { Integer } from './integer.component';
import { UI } from '@constants';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<Integer data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.LABEL]: 'integer label'
  };
  const { container } = render(<Integer data={data} />);
  expect(getByText(container, 'integer label')).toBeTruthy();
});

test('Renders the integer value', () => {
  const data = {
    [UI.LABEL]: 'integer label',
    [UI.VALUE]: '123'
  };
  const { container } = render(<Integer id="testid" data={data} />);
  expect(getByLabelText(container, 'integer label').value).toBe('123');
});
