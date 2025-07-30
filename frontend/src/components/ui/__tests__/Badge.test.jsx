import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

test('renders badge children', () => {
  render(<Badge>Test</Badge>);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
