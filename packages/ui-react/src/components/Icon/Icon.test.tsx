import React from 'react';
import { axe } from 'vitest-axe';
import { render } from '@testing-library/react';

import Icon from './Icon';

describe('<Icon>', () => {
  test('renders and matches snapshot', () => {
    const { container } = render(<Icon icon={vi.fn()} />);

    expect(container).toMatchSnapshot();
  });

  test('WCAG 2.2 (AA) compliant', async () => {
    const { container } = render(<Icon icon={vi.fn()} />);

    expect(await axe(container, { runOnly: ['wcag21a', 'wcag21aa', 'wcag22aa'] })).toHaveNoViolations();
  });
});
