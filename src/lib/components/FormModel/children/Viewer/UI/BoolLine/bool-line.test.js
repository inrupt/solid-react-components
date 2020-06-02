import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { getByLabelText } from '@testing-library/dom';

import { BoolLine } from './bool-line.component';
import { UI } from '@inrupt/lit-generated-vocab-common';

test('Renders with value and label', async () => {
  const data = {
    [UI.value]: '82346-123438-asdf8324',
    [UI.label]: 'Not a default content'
  };
  render(<BoolLine id="uniqueId" data={data} />);

  expect(screen.getByText('Not a default content')).toBeInTheDocument();
});

test('Renders without a label', async () => {
  const data = { [UI.value]: '345' };
  const { container } = render(<BoolLine id="234" data={data} />);
  expect(container.firstChild.firstChild).toBeEmpty();
});

test('Renders without a value', async () => {
  const data = { [UI.label]: 'Label for the bool' };
  const { container } = render(<BoolLine id="123" data={data} />);
  expect(getByLabelText(container, 'Label for the bool').checked).toBeFalsy();
});
