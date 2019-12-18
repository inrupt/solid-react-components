import React from 'react';
import { render, cleanup } from 'react-testing-library';
import CheckBox from './check-box.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<div />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
