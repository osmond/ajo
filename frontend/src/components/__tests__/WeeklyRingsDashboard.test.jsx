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

test('renders one path per week', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(makeTotals(14, 5000)),
  });

  const { container } = render(<WeeklyRingsDashboard weeksToShow={3} goalKm={40} />);
  await screen.findByTestId('weekly-rings');
  const paths = container.querySelectorAll('path');
  const expected = groupByWeek(makeTotals(14, 5000)).length;
  expect(paths.length).toBe(expected);
});

test('paths include animation classes and initial dash values', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(makeTotals(7, 5000)),
  });

  const { container } = render(<WeeklyRingsDashboard weeksToShow={1} goalKm={40} />);
  await screen.findByTestId('weekly-rings');
  const paths = container.querySelectorAll('path');
  paths.forEach((p) => {
    expect(p.getAttribute('stroke-dasharray')).toBe('0');
    expect(p.getAttribute('stroke-dashoffset')).toBe('0');
    const classes = Array.from(p.classList).join(' ');
    expect(classes).toMatch(/animate/);
  });
});
