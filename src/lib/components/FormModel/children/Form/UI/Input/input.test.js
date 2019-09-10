import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Input from './input.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<Input />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
