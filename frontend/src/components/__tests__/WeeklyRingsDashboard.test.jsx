import { render, screen } from '@testing-library/react';
import WeeklyRingsDashboard, { groupByWeek } from '../WeeklyRingsDashboard';
import { vi } from 'vitest';

afterEach(() => vi.restoreAllMocks());

function makeTotals(days, dist) {
  const totals = [];
  const start = new Date('2023-01-01');
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    totals.push({ date: d.toISOString().split('T')[0], distance: dist, duration: 0 });
  }
  return totals;
}

test('renders one circle per week', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(makeTotals(14, 5000)),
  });

  const { container } = render(<WeeklyRingsDashboard weeksToShow={3} goalKm={40} />);
  await screen.findByTestId('weekly-rings');
  const circles = container.querySelectorAll('circle');
  const expected = groupByWeek(makeTotals(14, 5000)).length;
  expect(circles.length).toBe(expected);
});

test('circles include animation style', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(makeTotals(7, 5000)),
  });

  const { container } = render(<WeeklyRingsDashboard weeksToShow={1} goalKm={40} />);
  await screen.findByTestId('weekly-rings');
  const circle = container.querySelector('circle');
  expect(circle.getAttribute('stroke-dasharray')).toBeTruthy();
  expect(circle.style.animation).toContain('draw-ring');
});
