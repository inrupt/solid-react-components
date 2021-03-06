import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import { UI } from '@inrupt/lit-generated-vocab-common';
import { CheckBox } from './check-box.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<CheckBox data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.label]: 'check'
  };
  const { container } = render(<CheckBox data={data} />);
  expect(getByText(container, 'check')).toBeTruthy();
});

test('Renders a checked box', () => {
  const data = {
    [UI.label]: 'checklabel',
    [UI.value]: 'true'
  };
  const { container } = render(<CheckBox id="testid" data={data} />);
  expect(getByLabelText(container, 'checklabel').checked).toBeTruthy();
});

test('Renders an unchecked box', () => {
  const data = {
    [UI.label]: 'checklabel',
    [UI.value]: 'false'
  };
  const { container } = render(<CheckBox id="testid" data={data} />);
  expect(getByLabelText(container, 'checklabel').checked).toBeFalsy();
});
