import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Comment from './comment.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<Comment />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
