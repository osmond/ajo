import { render } from '@testing-library/react';
import StreakFlame, { computeStreak } from '../StreakFlame';
import { vi } from 'vitest';

afterEach(() => vi.restoreAllMocks());

it('computeStreak counts consecutive days', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2023-01-04T00:00:00Z'));
  const totals = [
    { date: '2023-01-04', distance: 1 },
    { date: '2023-01-03', distance: 1 },
    { date: '2023-01-01', distance: 1 },
  ];
  expect(computeStreak(totals)).toBe(2);
});

it('renders correct intensity class', () => {
  const { container } = render(<StreakFlame count={8} />);
  const svg = container.querySelector('svg.lucide-flame');
  expect(svg.classList.contains('text-orange-500')).toBe(true);
  expect(svg.classList.contains('streak-active')).toBe(true);
});
