import React from 'react';
import { ShexConfig } from '@context';
import { cleanup, render } from 'react-testing-library';
import InputField from './input-field.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const config = { theme: {}, languageTheme: {}, config: {} };

const setup = props => {
  return (
    <ShexConfig.Provider value={config}>
      <InputField {...props} />
    </ShexConfig.Provider>
  );
};

describe('Shex ShapeForm Component', () => {
  const component = setup({});
  const { container, rerender } = render(component);

  it('should renders without crashing', () => {
    expect(container).toBeTruthy();
  });

  it('should renders error when come from props', () => {
    const component = setup({ inputData: { error: 'Error' } });

    rerender(component);
    expect(container).toHaveTextContent('Error');
  });
});
