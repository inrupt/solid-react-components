import React from 'react';
import { render, cleanup } from 'react-testing-library';
import DateTimePicker from './date-time-picker.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<DateTimePicker />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
