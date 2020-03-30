import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Uploader from './uploader.component';

const BasicComponent = () => <div data-testid="render-component">Basic Component</div>;

afterAll(cleanup);

describe('Solid Uploader', () => {
  describe('render without crashing', () => {
    it('should render uploader component', () => {
      const { container } = render(<Uploader render={() => <BasicComponent />} />);
      expect(container).toBeTruthy();
    });

    it('should render component by prop', () => {
      const { getByTestId } = render(<Uploader render={() => <BasicComponent />} />);
      const childComponent = getByTestId('render-component');
      expect(childComponent).toBeTruthy();
    });

    it('should render input file', () => {
      const { getByTestId } = render(<Uploader render={() => <BasicComponent />} />);
      const inputEl = getByTestId('input-file');
      expect(inputEl).toBeTruthy();
    });
  });
});
