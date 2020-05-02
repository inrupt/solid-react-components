import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import { SingleLine } from './single-line.component';
import { UI } from '@inrupt/lit-generated-vocab-common';

import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<SingleLine data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.label.value]: 'single'
  };
  const { container } = render(<SingleLine data={data} />);
  expect(getByText(container, 'single')).toBeTruthy();
});

test('Renders the value', () => {
  const data = {
    [UI.label.value]: 'single',
    [UI.value.value]: 'test value'
  };

  const { container } = render(<SingleLine id="testid" data={data} />);
  expect(getByLabelText(container, 'single').textContent).toBe('test value');
});
