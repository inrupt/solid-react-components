import React from 'react';
import { render, cleanup } from 'react-testing-library';
import TextArea from './text-area.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<TextArea />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});