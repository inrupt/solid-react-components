import React from 'react';
import { render, cleanup } from 'react-testing-library';
import FormModel from './form-model.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const setup = () => <FormModel model={{}} formValues={{}} />;

describe('FormModel Component', () => {
  const component = setup();
  const { container } = render(component);

  it('should renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
