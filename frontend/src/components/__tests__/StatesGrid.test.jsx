import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatesGrid from '../StatesGrid';

test('calls onSelect when state clicked', async () => {
  const onSelect = vi.fn();
  render(<StatesGrid onSelect={onSelect} />);
  const cell = screen.getByText('CA');
  await userEvent.click(cell);
  expect(onSelect).toHaveBeenCalledWith('CA');
});
