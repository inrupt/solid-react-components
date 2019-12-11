import React from 'react';

import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { FormModelConfig } from '@context';
import { FormModelUI } from '@constants';

import BoolLine from './bool-line.component';

afterEach(cleanup);

const ConfigContext = { theme: {} };

// eslint-disable-next-line react/prop-types
const ThemeProvider = ({ children }) => {
  return <FormModelConfig.Provider value={ConfigContext}>{children}</FormModelConfig.Provider>;
};

describe('renders the component properly', () => {
  const { UI_NAME, UI_LABEL } = FormModelUI;

  const props = {
    value: 'true',
    [UI_NAME]: 'component name',
    [UI_LABEL]: 'component label'
  };

  it('should render with full checked props', () => {
    const line = render(<BoolLine {...props} />, { wrapper: ThemeProvider });

    expect(line.container).toBeTruthy();
    expect(line.getByLabelText(props[UI_LABEL]).checked).toEqual(true);
  });

  it('should render with full unchecked props', () => {
    const line = render(<BoolLine {...{ ...props, value: 'false' }} />, { wrapper: ThemeProvider });

    expect(line.getByLabelText(props[UI_LABEL]).checked).toEqual(false);
  });

  it('should render without a label', () => {
    const line = render(<BoolLine {...{ ...props, [UI_LABEL]: undefined }} />, {
      wrapper: ThemeProvider
    });

    expect(line.getByLabelText('').checked).toEqual(true);
  });

  it('should not render without a name', () => {
    const line = render(<BoolLine {...{ ...props, [UI_NAME]: undefined }} />, {
      wrapper: ThemeProvider
    });

    expect(line.queryByLabelText(props[UI_LABEL])).toEqual(null);
    expect(line.queryByText(props[UI_LABEL])).toEqual(null);
  });
});
