import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import { Integer } from './integer.component';
import 'jest-dom/extend-expect';
import { UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<Integer data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.label.value]: 'integer label'
  };
  const { container } = render(<Integer data={data} />);
  expect(getByText(container, 'integer label')).toBeTruthy();
});

test('Renders the integer value', () => {
  const data = {
    [UI.label.value]: 'integer label',
    [UI.value.value]: '123'
  };
  const { container } = render(<Integer id="testid" data={data} />);
  expect(getByLabelText(container, 'integer label').value).toBe('123');
});
