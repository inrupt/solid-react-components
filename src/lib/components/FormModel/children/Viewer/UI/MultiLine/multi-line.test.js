import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import MultiLine from './multi-line.component';
import { UI } from '@solid/lit-vocab-common';

import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<MultiLine data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.label]: 'multi'
  };
  const { container } = render(<MultiLine data={data} />);
  expect(getByText(container, 'multi')).toBeTruthy();
});

test('Renders the value', () => {
  const data = {
    [UI.label]: 'multi',
    [UI.value]: `test\nvalue`
  };

  const { container } = render(<MultiLine id="testid" data={data} />);
  const multiLineContainer = getByLabelText(container, 'multi');
  expect(multiLineContainer.textContent).toBe('test\nvalue');
});
