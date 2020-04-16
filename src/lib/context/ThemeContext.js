import { createContext } from 'react';

const defaultContext = {
  theme: {}
};

export const ThemeContext = createContext(defaultContext);
