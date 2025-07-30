import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatesGrid from '../StatesGrid';

test('shows cities when state clicked', async () => {
  render(<StatesGrid />);
  const cell = screen.getByText('CA');
  await userEvent.click(cell);
  expect(screen.getByText('California')).toBeInTheDocument();
  expect(screen.getByText('Los Angeles')).toBeInTheDocument();
});
