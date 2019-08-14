import React from 'react';
import { render, cleanup } from 'react-testing-library';
import InputText from './input-text.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<InputText />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
