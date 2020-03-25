import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByLabelText } from '@testing-library/dom';
import { UI } from '@constants';
import { RadioButton } from './radio-button.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('should render without crashing', () => {
  const { container } = render(<RadioButton data={{}} />);
  expect(container).toBeTruthy();
});

test('should render a label', () => {
  const data = {
    [UI.LABEL]: '123'
  };
  const { container } = render(<RadioButton id="testId" data={data} />);

  expect(getByLabelText(container, '123')).toBeTruthy();
});

test('should render a selected radio button', () => {
  const data = {
    [UI.LABEL]: '123',
    [UI.VALUE]: true
  };
  const { container } = render(<RadioButton id="testId" data={data} />);

  const radioElement = getByLabelText(container, '123');
  expect(radioElement.value).toBeTruthy();
});
