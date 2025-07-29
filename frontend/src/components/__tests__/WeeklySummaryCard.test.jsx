import { render, screen } from '@testing-library/react';
import WeeklySummaryCard from '../WeeklySummaryCard';
import { vi } from 'vitest';

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

it('shows distance trend vs last week', async () => {
  const steps = Array.from({ length: 14 }, (_, i) => ({
    timestamp: `2023-01-${String(i + 1).padStart(2, '0')}T00:00:00`,
    value: 1000,
  }));
  const sleep = Array.from({ length: 14 }, (_, i) => ({
    timestamp: `2023-01-${String(i + 1).padStart(2, '0')}T00:00:00`,
    value: 6,
  }));
  const totals = Array.from({ length: 14 }, (_, i) => ({
    date: `2023-01-${String(i + 1).padStart(2, '0')}`,
    distance: i < 7 ? 1000 : 2000,
    duration: 0,
  }));

  global.fetch = vi.fn((url) => {
    if (url === '/steps') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(steps) });
    }
    if (url === '/sleep') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(sleep) });
    }
    if (url === '/daily-totals') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(totals) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  });

  render(<WeeklySummaryCard />);
  await screen.findByText(/vs last week/);
  expect(screen.getByText('▲ 100.0%')).toBeInTheDocument();
});
