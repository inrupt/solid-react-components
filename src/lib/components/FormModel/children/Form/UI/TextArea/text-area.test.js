import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import { TextArea } from './text-area.component';
import { UI } from '@constants';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<TextArea data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.LABEL]: 'text area label'
  };
  const { container } = render(<TextArea data={data} />);
  expect(getByText(container, 'text area label')).toBeTruthy();
});

test('Renders the text area value', () => {
  const data = {
    [UI.LABEL]: 'text area label',
    [UI.VALUE]: 'Lorem ipsum'
  };
  const { container } = render(<TextArea id="testid" data={data} />);
  expect(getByLabelText(container, 'text area label').value).toBe('Lorem ipsum');
});
