import React from 'react';
import { render, cleanup } from 'react-testing-library';
import DateTimePicker from './date-time-picker.component';
import 'jest-dom/extend-expect';
import { UITypes } from '@constants';

afterAll(cleanup);

describe('Time picker should render', () => {
  const props = {
    formObject: {},
    value: '11:00:15',
    'rdf:type': UITypes.TimeField
  };

  const { container } = render(<DateTimePicker {...props} />);

  it('should render without crashing', () => {
    expect(container).toBeTruthy();
  });
});

describe('Date picker should render', () => {
  const props = {
    formObject: {},
    value: '2011-06-06',
    'rdf:type': UITypes.DateField
  };

  const { container } = render(<DateTimePicker {...props} />);

  it('should render without crashing', () => {
    expect(container).toBeTruthy();
  });
});

describe('Datetime picker should render', () => {
  const props = {
    formObject: {},
    value: '2019-11-29T04:00:00.000Z',
    'rdf:type': UITypes.DateTimeField
  };

  const { container } = render(<DateTimePicker {...props} />);

  it('should render without crashing', () => {
    expect(container).toBeTruthy();
  });
});

describe('Datetime picker should render with undefined value', () => {
  const props = {
    formObject: {},
    value: undefined,
    'rdf:type': UITypes.DateTimeField
  };

  const { container } = render(<DateTimePicker {...props} />);

  it('should render without crashing', () => {
    expect(container).toBeTruthy();
  });
});

describe('Timepicker should render with undefined value', () => {
  const props = {
    formObject: {},
    value: undefined,
    'rdf:type': UITypes.TimeField
  };

  const { container } = render(<DateTimePicker {...props} />);

  it('should render without crashing', () => {
    expect(container).toBeTruthy();
  });
});

describe('Date picker should render with undefined value', () => {
  const props = {
    formObject: {},
    value: undefined,
    'rdf:type': UITypes.DateField
  };

  const { container } = render(<DateTimePicker {...props} />);

  it('should render without crashing', () => {
    expect(container).toBeTruthy();
  });
});
