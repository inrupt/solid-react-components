import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Decimal from './decimal.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<Decimal />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
