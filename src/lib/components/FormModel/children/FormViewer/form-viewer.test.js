import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

import { FormViewer } from './form-viewer.component';

afterEach(cleanup);

describe('viewer exists', () => {
  const props = {};

  const viewer = render(<FormViewer {...props} />);

  it('should render', () => {
    expect(viewer).toBeTruthy();
  });
});

describe('viewer take the right props and fails gracefully with missing props', () => {
  it('should error with missing form model', () => {
    const noFormModelProps = { a: 1, b: 2 };
    const viewer = render(<FormViewer {...noFormModelProps} />);

    expect(viewer.getByText('Invalid Props')).toBeInTheDocument();
  });

  it('should render an empty form model', () => {
    const emptyModelProps = { formModel: { a: 1 } };
    const viewer = render(<FormViewer {...emptyModelProps} />);

    expect(viewer.getByText('Invalid Props')).toBeInTheDocument();
  });
});
