import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Select from './select.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<Select />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
