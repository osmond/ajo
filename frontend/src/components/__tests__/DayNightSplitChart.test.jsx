import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import DayNightSplitChart, { computeDayNightMiles } from '../DayNightSplitChart';

afterEach(() => vi.restoreAllMocks());

beforeAll(() => {
  global.ResizeObserver = class {
    constructor(cb) { this.cb = cb; }
    observe() { this.cb([{ contentRect: { width: 100, height: 80 } }]); }
    unobserve() {}
    disconnect() {}
  };
  HTMLElement.prototype.getBoundingClientRect = () => ({
    width: 100,
    height: 80,
    top: 0,
    left: 0,
    bottom: 80,
    right: 100,
  });
});

test('computeDayNightMiles sums miles by time of day', () => {
  const acts = [
    { startTimeLocal: '2023-01-01T10:00:00', distance: 1609.34 },
    { startTimeLocal: '2023-01-01T20:00:00', distance: 1609.34 },
  ];
  const { day, night } = computeDayNightMiles(acts);
  expect(day).toBeCloseTo(1);
  expect(night).toBeCloseTo(1);
});

test('renders total miles label', async () => {
  const acts = [
    { startTimeLocal: '2023-01-01T10:00:00', distance: 1600 },
    { startTimeLocal: '2023-01-01T20:00:00', distance: 3200 },
  ];
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(acts),
  });

  render(<DayNightSplitChart />);
  const label = await screen.findByText('3.0 mi');
  expect(label).toBeInTheDocument();
});
