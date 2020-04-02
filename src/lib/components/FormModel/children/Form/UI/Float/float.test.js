import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import { Float } from './float.component';
import { UI } from '@constants';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<Float data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.LABEL]: 'float label'
  };
  const { container } = render(<Float data={data} />);
  expect(getByText(container, 'float label')).toBeTruthy();
});

test('Renders the float value', () => {
  const data = {
    [UI.VALUE]: '123.43',
    [UI.LABEL]: 'float label'
  };

  const { container } = render(<Float id="testid" data={data} />);
  expect(getByLabelText(container, 'float label').value).toBe('123.43');
});
