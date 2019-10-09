import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Heading from './heading.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<Heading />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
