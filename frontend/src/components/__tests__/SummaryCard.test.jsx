import { render, screen } from '@testing-library/react';
import SummaryCard, { computeSummary } from '../SummaryCard';
import { vi } from 'vitest';

vi.mock('../TrackMap', () => ({ default: () => <div data-testid="track" /> }));

beforeAll(() => {
  global.ResizeObserver = class {
    constructor(cb) {
      this.cb = cb;
    }
    observe() {
      this.cb([{ contentRect: { width: 100, height: 80 } }]);
    }
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

it('computeSummary totals runs and streak', () => {
  const data = [
    { date: '2023-01-03', distance: 1000, duration: 300 },
    { date: '2023-01-02', distance: 2000, duration: 600 },
    { date: '2023-01-01', distance: 3000, duration: 900 },
  ];
  const result = computeSummary(data);
  expect(result.runCount).toBe(3);
  expect(result.totalDistance).toBe(6000);
  expect(result.totalDuration).toBe(1800);
  expect(result.streak).toBe(3);
});

it('renders totals from API data', async () => {
  const runs = [
    { date: '2023-01-01', distance: 5000, duration: 1800 },
    { date: '2023-01-02', distance: 6000, duration: 1800 },
  ];
  global.fetch = vi.fn((url) => {
    if (url === '/runs') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(runs) });
    }
    if (url.startsWith('/activities?')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ activityId: 'a1' }]),
      });
    }
    if (url === '/activities/a1/track') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  });

  render(<SummaryCard />);
  const km = ((5000 + 6000) / 1000).toFixed(1);
  expect(await screen.findByText(/2 runs/)).toBeInTheDocument();
  expect(await screen.findByText(new RegExp(`${km}`))).toBeInTheDocument();
});
