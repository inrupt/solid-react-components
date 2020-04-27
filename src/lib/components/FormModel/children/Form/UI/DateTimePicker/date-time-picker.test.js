import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { DateTimePicker } from './date-time-picker.component';
import 'jest-dom/extend-expect';
import { RDF, UI } from '@pmcb55/lit-generated-vocab-common-rdfext';

afterAll(cleanup);

test('Time picker should render', () => {
  const data = {
    formObject: {},
    value: '11:00:15',
    [RDF.type.value]: UI.TimeField.value
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});

test('Date picker should render', () => {
  const data = {
    formObject: {},
    value: '2011-06-06',
    [RDF.type.value]: UI.DateField.value
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});

test('Datetime picker should render', () => {
  const data = {
    formObject: {},
    value: '2019-11-29T04:00:00.000Z',
    [RDF.type.value]: UI.DateTimeField.value
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});

test('Datetime picker should render with undefined value', () => {
  const data = {
    formObject: {},
    value: undefined,
    [RDF.type.value]: UI.DateTimeField.value
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});

test('Timepicker should render with undefined value', () => {
  const data = {
    formObject: {},
    value: undefined,
    [RDF.type.value]: UI.TimeField.value
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});

test('Date picker should render with undefined value', () => {
  const data = {
    formObject: {},
    value: undefined,
    [RDF.type.value]: UI.DateField.value
  };

  const { container } = render(<DateTimePicker data={data} />);
  expect(container).toBeTruthy();
});
