import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Uploader from './uploader.component';

const BasicComponent = () => <div data-testid="render-component">Basic Component</div>;

afterAll(cleanup);

describe('Solid Uploader', () => {
  describe('render without crashing', () => {
    const { container, getByTestId } = render(<Uploader render={() => <BasicComponent />} />);

    it('should render uploader component', () => {
      expect(container).toBeTruthy();
    });

    it('should render component by prop', () => {
      const childComponent = getByTestId('render-component');
      expect(childComponent).toBeTruthy();
    });

    it('should render input file', () => {
      const inputEl = getByTestId('input-file');
      expect(inputEl).toBeTruthy();
    });
  });
});
