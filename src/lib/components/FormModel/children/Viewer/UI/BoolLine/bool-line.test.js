import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { UI } from '@constants';
import { BoolLine } from './bool-line.component';

test('Renders with value and label', async () => {
  const data = { [UI.VALUE]: '82346-123438-asdf8324', [UI.LABEL]: 'Not a default content' };
  render(<BoolLine id="uniqueId" data={data} />);

  expect(screen.getByText('Not a default content')).toBeInTheDocument();
});

test('Renders without a label', async () => {
  const data = { [UI.VALUE]: '345' };
  const { container } = render(<BoolLine id="234" data={data} />);
  expect(container.firstChild.firstChild).toBeEmpty();
});

test('Renders without a value', async () => {
  const data = { [UI.LABEL]: 'Label for the bool' };
  const { container } = render(<BoolLine id="123" data={data} />);
  expect(container.lastChild).toBeEmpty();
});
