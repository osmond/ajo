import { render, screen } from '@testing-library/react';
import WeeklySummaryCard, { computeStats } from '../WeeklySummaryCard';
import { vi } from 'vitest';

afterEach(() => vi.restoreAllMocks());

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

it('computeStats returns totals and percentages', () => {
  const currSteps = [{ value: 200 }, { value: 200 }];
  const prevSteps = [{ value: 100 }, { value: 100 }];
  const currSleep = [{ value: 6 }, { value: 6 }];
  const prevSleep = [{ value: 5 }, { value: 5 }];
  const currTotals = [{ distance: 2000 }, { distance: 2000 }];
  const prevTotals = [{ distance: 1000 }, { distance: 1000 }];
  const result = computeStats(currSteps, prevSteps, currSleep, prevSleep, currTotals, prevTotals);
  expect(result.totalSteps).toBe(400);
  expect(result.totalSleep).toBe(12);
  expect(result.totalDistanceKm).toBe(4);
  expect(result.stepsPct).toBeCloseTo(100);
  expect(result.sleepPct).toBeCloseTo(20);
  expect(result.distancePct).toBeCloseTo(100);
});

it('renders trend indicators with arrows', async () => {
  const makeData = () => {
    const start = new Date('2023-01-01');
    const steps = [];
    const sleep = [];
    const totals = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(start.getTime() + i * 86400000);
      const stamp = d.toISOString();
      steps.push({ timestamp: stamp, value: i < 7 ? 100 : 200 });
      sleep.push({ timestamp: stamp, value: i < 7 ? 5 : 6 });
      const date = stamp.split('T')[0];
      totals.push({ date, distance: i < 7 ? 1000 : 2000, duration: 0 });
    }
    return { steps, sleep, totals };
  };
  const { steps, sleep, totals } = makeData();

  global.fetch = vi.fn((url) => {
    if (url.endsWith('/steps')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(steps) });
    }
    if (url.endsWith('/sleep')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(sleep) });
    }
    if (url.endsWith('/daily-totals')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(totals) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  });

  const { container } = render(<WeeklySummaryCard />);
  await screen.findByText('vs last week');
  // Should render three up arrows
  const arrows = container.querySelectorAll('svg.lucide-arrow-up-right');
  expect(arrows.length).toBeGreaterThanOrEqual(3);
  expect(screen.getAllByText('100%')[0]).toBeInTheDocument();
});

it('shows N/A when previous totals are zero', async () => {
  const makeData = () => {
    const start = new Date('2023-01-01');
    const steps = [];
    const sleep = [];
    const totals = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(start.getTime() + i * 86400000);
      const stamp = d.toISOString();
      steps.push({ timestamp: stamp, value: i < 7 ? 0 : 200 });
      sleep.push({ timestamp: stamp, value: i < 7 ? 0 : 6 });
      const date = stamp.split('T')[0];
      totals.push({ date, distance: i < 7 ? 0 : 2000, duration: 0 });
    }
    return { steps, sleep, totals };
  };
  const { steps, sleep, totals } = makeData();

  global.fetch = vi.fn((url) => {
    if (url.endsWith('/steps')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(steps) });
    }
    if (url.endsWith('/sleep')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(sleep) });
    }
    if (url.endsWith('/daily-totals')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(totals) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  });

  render(<WeeklySummaryCard />);
  await screen.findByText('vs last week');
  const naTexts = screen.getAllByText('N/A');
  expect(naTexts.length).toBeGreaterThanOrEqual(3);
});
