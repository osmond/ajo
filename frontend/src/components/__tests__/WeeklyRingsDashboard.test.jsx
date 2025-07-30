import { render, screen } from '@testing-library/react';
import WeeklyRingsDashboard, { groupByWeekByType } from '../WeeklyRingsDashboard';
import { vi } from 'vitest';

afterEach(() => vi.restoreAllMocks());

function makeActivities(days, dist) {
  const acts = [];
  const start = new Date('2023-01-01');
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    acts.push({
      startTimeLocal: d.toISOString(),
      distance: dist,
      duration: 0,
      activityType: { typeKey: i % 2 ? 'RUN' : 'BIKE' },
    });
  }
  return acts;
}

test('renders segments for each week', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(makeActivities(14, 5000)),
  });

  const { container } = render(<WeeklyRingsDashboard weeksToShow={3} goalKm={40} />);
  await screen.findByTestId('weekly-rings');
  const paths = container.querySelectorAll('path');
  const weeks = groupByWeekByType(makeActivities(14, 5000));
  const expected = weeks.reduce(
    (s, w) => s + (w.runKm > 0 ? 1 : 0) + (w.bikeKm > 0 ? 1 : 0),
    0
  );
  expect(paths.length).toBe(expected);
});

test('paths include animation classes and initial dash values', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(makeActivities(7, 5000)),
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

test('renders legend labels', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(makeActivities(7, 5000)),
  });

  render(<WeeklyRingsDashboard weeksToShow={1} goalKm={40} />);
  await screen.findByTestId('rings-legend');
  expect(screen.getByText('Run')).toBeInTheDocument();
  expect(screen.getByText('Bike')).toBeInTheDocument();
});
