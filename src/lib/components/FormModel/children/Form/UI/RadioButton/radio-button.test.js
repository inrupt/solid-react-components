import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByLabelText } from '@testing-library/dom';
import { RadioButton } from './radio-button.component';
import 'jest-dom/extend-expect';
import { UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

afterAll(cleanup);

test('should render without crashing', () => {
  const { container } = render(<RadioButton data={{}} />);
  expect(container).toBeTruthy();
});

test('should render a label', () => {
  const data = {
    [UI.label.value]: '123'
  };
  const { container } = render(<RadioButton id="testId" data={data} />);

  expect(getByLabelText(container, '123')).toBeTruthy();
});

test('should render a selected radio button', () => {
  const data = {
    [UI.label.value]: '123',
    [UI.value.value]: true
  };
  const { container } = render(<RadioButton id="testId" data={data} />);

  const radioElement = getByLabelText(container, '123');
  expect(radioElement.value).toBeTruthy();
});
