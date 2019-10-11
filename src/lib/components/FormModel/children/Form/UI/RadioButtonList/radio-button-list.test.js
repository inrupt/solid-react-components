import React from 'react';
import { render, cleanup } from 'react-testing-library';
import RadioButtonList from './check-box.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<RadioButtonList />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
