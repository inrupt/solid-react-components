import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Float from './float.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<Float />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
