import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { ProviderSelect } from '@components';

afterAll(cleanup);

describe('ProviderSelect', () => {
  const { container } = render(<ProviderSelect />);
  it('should render without crashing', () => {
    expect(container).toBeTruthy();
  });
});
