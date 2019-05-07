import React from 'react';
import { Language } from '@context';
import { cleanup, render } from 'react-testing-library';
import { AddButton } from './add-button.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const languageTheme = {
  language: 'en',
  addButtonText: '+ Add new '
};

const defaultExpression = {
  annotations: []
};

const setup = (props, languageTheme) => {
  return (
    <Language.Provider value={languageTheme}>
      <AddButton {...props} />
    </Language.Provider>
  );
};

describe('Shex ShapeForm Component', () => {
  const component = setup(
    { allowNewFields: true, defaultExpression },
    languageTheme
  );
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
      languageTheme
    );

    rerender(component);
    expect(container).toHaveTextContent('+ Agregar');
  });

  it('should not renders if allowNewField is false', () => {
    const component = setup(
      { allowNewFields: false, defaultExpression },
      languageTheme
    );
    rerender(component);

    expect(container).toHaveTextContent('');
  });
});
