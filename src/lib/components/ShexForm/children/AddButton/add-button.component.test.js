import React from 'react';
import { ShexConfig } from '@context';
import { cleanup, render } from 'react-testing-library';
import AddButton from './add-button.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const config = {
  languageTheme: {
    language: 'en',
    addButtonText: '+ Add new '
  },
  theme: {},
  config: {}
};

const defaultExpression = {
  annotations: []
};

const setup = (props, config) => {
  return (
    <ShexConfig.Provider value={config}>
      <AddButton {...props} />
    </ShexConfig.Provider>
  );
};

describe('Shex ShapeForm Component', () => {
  const component = setup({ allowNewFields: true, defaultExpression }, config);
  const { container, rerender } = render(component);

  it('should renders without crashing', () => {
    expect(container).toBeTruthy();
  });

  it('should renders language version', () => {
    const languageTheme = {
      language: 'es',
      addButtonText: '+ Agregar '
    };
    const component = setup(
      { allowNewFields: true, defaultExpression },
      { ...config, languageTheme }
    );

    rerender(component);
    expect(container).toHaveTextContent('+ Agregar');
  });

  it('should not renders if allowNewField is false', () => {
    const component = setup(
      { allowNewFields: false, defaultExpression },
      config
    );
    rerender(component);

    expect(container).toHaveTextContent('');
  });
});
