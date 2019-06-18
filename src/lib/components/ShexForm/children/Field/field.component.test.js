import React from 'react';
import { cleanup, render } from 'react-testing-library';
import Field from './field.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const setup = props => {
  return <Field {...props} />;
};

describe('Shex ShapeForm Component', () => {
  const component = setup({
    data: { valueExpr: {} },
    inputData: { name: 'test' }
  });
  const { container } = render(component);

  it('should renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
