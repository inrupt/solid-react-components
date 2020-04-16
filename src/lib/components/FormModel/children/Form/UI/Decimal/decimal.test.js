import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText } from '@testing-library/dom';
import { Decimal } from './decimal.component';
import { UI } from '@constants';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<Decimal data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the decimal label', () => {
  const data = {
    [UI.LABEL]: 'decimal label'
  };
  const { container } = render(<Decimal data={data} />);
  expect(getByText(container, 'decimal label')).toBeTruthy();
});
