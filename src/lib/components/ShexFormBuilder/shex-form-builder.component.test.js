import React from 'react';
import { cleanup, render } from 'react-testing-library';
import ShexFormBuilder from './shex-form-builder.component';
import { act } from 'react-dom/test-utils';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const setup = props => {
  return <ShexFormBuilder {...props} />;
};

const defaultProps = {
  documentUri: '',
  shexUri: 'https://jpablo.solid.community/public/shapes/profile.shex',
  successCallback: null,
  errorCallback: null
};
describe('Shex ShapeForm Component', () => {
  let container;
  act(() => {
    const component = setup(defaultProps);
    const options = render(component);
    container = options.container;
  });

  it('should render without crashing', () => {
    expect(container).toBeTruthy();
  });
});
