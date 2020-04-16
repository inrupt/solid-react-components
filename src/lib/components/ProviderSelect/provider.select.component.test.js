import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { ProviderSelect } from '@components';

afterAll(cleanup);

describe('ProviderSelect', () => {
  const { container } = render(<ProviderSelect />);
  it('should render without crashing', () => {
    expect(container).toBeTruthy();
  });
});
