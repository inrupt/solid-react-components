import React from 'react';
import { ShexConfig } from '@context';
import { cleanup, render } from 'react-testing-library';
import DropDownField from './dropdown-field.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const config = { theme: {}, languageTheme: {}, config: {} };

const setup = props => {
  return (
    <ShexConfig.Provider value={config}>
      <DropDownField {...props} />
    </ShexConfig.Provider>
  );
};

describe('Shex ShapeForm Component', () => {
  const component = setup({ values: ['option1', ['option 1']] });
  const { container, rerender } = render(component);

  it('should renders without crashing', () => {
    expect(container).toBeTruthy();
  });

  it('should renders with object values', () => {
    const component = setup({
      values: [{ value: 'option1' }, { value: 'option 2' }]
    });

    rerender(component);
    expect(container).toBeTruthy();
  });
});
