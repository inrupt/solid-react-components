import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { DateTimePicker } from './date-time-picker.component';
import 'jest-dom/extend-expect';
import { UITypes } from '@constants';

afterAll(cleanup);

test('Time picker should render', () => {
  const data = {
    formObject: {},
    value: '11:00:15',
    'rdf:type': UITypes.TimeField
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});

test('Date picker should render', () => {
  const data = {
    formObject: {},
    value: '2011-06-06',
    'rdf:type': UITypes.DateField
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});

test('Datetime picker should render', () => {
  const data = {
    formObject: {},
    value: '2019-11-29T04:00:00.000Z',
    'rdf:type': UITypes.DateTimeField
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});

test('Datetime picker should render with undefined value', () => {
  const data = {
    formObject: {},
    value: undefined,
    'rdf:type': UITypes.DateTimeField
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});

test('Timepicker should render with undefined value', () => {
  const data = {
    formObject: {},
    value: undefined,
    'rdf:type': UITypes.TimeField
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});

test('Date picker should render with undefined value', () => {
  const data = {
    formObject: {},
    value: undefined,
    'rdf:type': UITypes.DateField
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});
