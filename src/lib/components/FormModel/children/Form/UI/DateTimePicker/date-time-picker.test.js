import React from 'react';
import { render, cleanup } from 'react-testing-library';
import DateTimePicker from './date-time-picker.component';
import 'jest-dom/extend-expect';

afterAll(cleanup);

describe('Time picker should render', () => {
  const props = {
    formObject: {},
    value: '11:00:15'
  };

  const { container } = render(<DateTimePicker {...props} />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});

describe('Date picker should render', () => {
  const props = {
    formObject: {},
    value: '2011-06-06'
  };

  const { container } = render(<DateTimePicker {...props} />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});

describe('Datetime picker should render', () => {
  const props = {
    formObject: {},
    value: '2019-11-29T04:00:00.000Z'
  };

  const { container } = render(<DateTimePicker {...props} />);

  it('shoud renders without crashing', () => {
    expect(container).toBeTruthy();
  });
});
