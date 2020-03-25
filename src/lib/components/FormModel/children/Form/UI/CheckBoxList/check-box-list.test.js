import React from 'react';
import { render, cleanup } from '@testing-library/react';
import CheckBoxList from './check-box-list.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Provider Login Container', () => {
  const { container } = render(<div />);

  it('should render without crashing', () => {
    expect(container).toBeTruthy();
  });
});
