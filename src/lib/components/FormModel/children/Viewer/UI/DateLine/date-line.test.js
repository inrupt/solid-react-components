import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import DateLine from './date-line.component';
import 'jest-dom/extend-expect';
import { RDF, UI } from '@inrupt/lit-generated-vocab-common';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<DateLine data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.label]: 'date label'
  };
  const { container } = render(<DateLine data={data} />);
  expect(getByText(container, 'date label')).toBeTruthy();
});

describe('Renders the value depending on the type', () => {
  it('Renders a time', () => {
    const data = {
      [RDF.type]: UI.TimeField.value,
      [UI.value]: '09:12:44'
    };

    const { container } = render(<DateLine data={data} />);

    expect(getByText(container, '9:12 AM')).toBeTruthy();
  });

  it('Renders a date', () => {
    const data = {
      [RDF.type]: UI.DateField.value,
      [UI.value]: '2020-01-13'
    };

    const { container } = render(<DateLine data={data} />);
    expect(getByText(container, '01/13/2020')).toBeTruthy();
  });

  it('Renders a datetime', () => {
    const data = {
      [RDF.type]: UI.DateTimeField.value,
      [UI.value]: '2020-01-13 09:12:44'
    };

    const { container } = render(<DateLine data={data} />);
    expect(getByText(container, '01/13/2020, 9:12 AM')).toBeTruthy();
  });
});
