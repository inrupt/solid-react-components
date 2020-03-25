import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText } from '@testing-library/dom';
import ColorPicker from './color-picker.component';
import { UI } from '@constants';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<ColorPicker data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.LABEL]: 'choose color'
  };
  const { container } = render(<ColorPicker data={data} />);
  expect(getByText(container, 'choose color')).toBeTruthy();
});

test('Renders the color in text', () => {
  const data = {
    [UI.LABEL]: 'choose color',
    [UI.VALUE]: '#aabbcc'
  };
  const { container } = render(<ColorPicker data={data} />);
  expect(getByText(container, '#aabbcc')).toBeTruthy();
});
