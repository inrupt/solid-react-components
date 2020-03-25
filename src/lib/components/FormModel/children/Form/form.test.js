import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Form from './form.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

const setup = () => <div />;

describe('FormModel Form Component', () => {
  const component = setup();
  const { container } = render(component);

  it('should renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
