import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DarkModeToggle from '../DarkModeToggle'
import { ThemeProvider } from 'next-themes'

it('toggles dark class on html element', async () => {
  render(
    <ThemeProvider attribute="class" defaultTheme="light">
      <DarkModeToggle />
    </ThemeProvider>
  )
  const btn = screen.getByRole('button')
  await userEvent.click(btn)
  expect(document.documentElement.classList.contains('dark')).toBe(true)
  await userEvent.click(btn)
  expect(document.documentElement.classList.contains('light')).toBe(true)
})
