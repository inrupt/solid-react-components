import React from 'react';
import { render, cleanup } from 'react-testing-library';
import RadioButton from './radio-button.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<RadioButton />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
