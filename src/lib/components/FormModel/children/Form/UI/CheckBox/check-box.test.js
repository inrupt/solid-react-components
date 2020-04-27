import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import { CheckBox } from './check-box.component';
import { UI } from '@pmcb55/lit-generated-vocab-common-rdfext';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<CheckBox data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.label.value]: 'check'
  };
  const { container } = render(<CheckBox data={data} />);
  expect(getByText(container, 'check')).toBeTruthy();
});

test('Renders a checked box', () => {
  const data = {
    [UI.label.value]: 'checklabel',
    [UI.value.value]: 'true'
  };
  const { container } = render(<CheckBox id="testid" data={data} />);
  expect(getByLabelText(container, 'checklabel').checked).toBeTruthy();
});

test('Renders an unchecked box', () => {
  const data = {
    [UI.label.value]: 'checklabel',
    [UI.value.value]: 'false'
  };
  const { container } = render(<CheckBox id="testid" data={data} />);
  expect(getByLabelText(container, 'checklabel').checked).toBeFalsy();
});
