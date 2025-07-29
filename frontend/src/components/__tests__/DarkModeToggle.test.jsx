import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DarkModeToggle from '../DarkModeToggle';
import { ThemeProvider } from '../../ThemeContext';

beforeAll(() => {
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener: () => {}, removeListener: () => {} }));
});

it('toggles dark class on html element', async () => {
  render(
    <ThemeProvider>
      <DarkModeToggle />
    </ThemeProvider>
  );
  const btn = screen.getByRole('button', { name: /dark/i });
  await userEvent.click(btn);
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  await userEvent.click(btn);
  expect(document.documentElement.classList.contains('dark')).toBe(false);
});
