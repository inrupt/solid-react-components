import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { ColorLine } from './color-line.component';
import { UI } from '@inrupt/lit-generated-vocab-common';

test('Renders with value and label', async () => {
  const data = { [UI.value]: '82346-123438-asdf8324', [UI.label]: 'Set content' };
  render(<ColorLine data={data} />);

  expect(screen.getByText('Set content')).toBeInTheDocument();
});

test('Renders without label', async () => {
  const data = { [UI.value]: '234-542340-sdf58923' };
  const { container } = render(<ColorLine data={data} />);

  expect(container.firstChild.firstChild).toBeEmpty();
});
