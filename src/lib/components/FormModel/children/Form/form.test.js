import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Form from './form-model.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const setup = () => <Form model={{}} formValues={{}} />;

describe('FormModel Form Component', () => {
  const component = setup();
  const { container } = render(component);

  it('should renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
