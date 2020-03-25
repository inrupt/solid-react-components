import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getByText, getByLabelText } from '@testing-library/dom';
import DateLine from './date-line.component';
import { UI, UITypes, RDF } from '@constants';
import 'jest-dom/extend-expect';

afterAll(cleanup);

test('Renders without crashing', () => {
  const data = {};
  const { container } = render(<DateLine data={data} />);
  expect(container).toBeTruthy();
});

test('Renders the label', () => {
  const data = {
    [UI.LABEL]: 'date label'
  };
  const { container } = render(<DateLine data={data} />);
  expect(getByText(container, 'date label')).toBeTruthy();
});

describe('Renders the value depending on the type', () => {
  it('Renders a time', () => {
    const data = {
      [RDF.TYPE]: UITypes.TimeField,
      [UI.VALUE]: '09:12:44'
    };

    const { container } = render(<DateLine data={data} />);

    expect(getByText(container, '9:12 AM')).toBeTruthy();
  });

  it('Renders a date', () => {
    const data = {
      [RDF.TYPE]: UITypes.DateField,
      [UI.VALUE]: '2020-01-13'
    };

    const { container } = render(<DateLine data={data} />);
    expect(getByText(container, '01/13/2020')).toBeTruthy();
  });

  it('Renders a datetime', () => {
    const data = {
      [RDF.TYPE]: UITypes.DateTimeField,
      [UI.VALUE]: '2020-01-13 09:12:44'
    };

    const { container } = render(<DateLine data={data} />);
    expect(getByText(container, '01/13/2020, 9:12 AM')).toBeTruthy();
  });
});
