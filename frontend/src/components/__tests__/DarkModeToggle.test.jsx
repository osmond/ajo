import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DarkModeToggle from '../DarkModeToggle';

it('toggles dark class on html element', async () => {
  render(<DarkModeToggle />);
  const btn = screen.getByRole('button', { name: /dark/i });
  await userEvent.click(btn);
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  await userEvent.click(btn);
  expect(document.documentElement.classList.contains('dark')).toBe(false);
});
