import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import FitnessBreakdownChart from '../FitnessBreakdownChart';

afterEach(() => vi.restoreAllMocks());

beforeAll(() => {
  global.ResizeObserver = class {
    constructor(cb) { this.cb = cb; }
    observe() { this.cb([{ contentRect: { width: 120, height: 120 } }]); }
    unobserve() {}
    disconnect() {}
  };
  HTMLElement.prototype.getBoundingClientRect = () => ({
    width: 120,
    height: 120,
    top: 0,
    left: 0,
    bottom: 120,
    right: 120,
  });
});

function mockMetric(val) {
  return [{ timestamp: '2023-01-01T00:00:00', value: val }];
}

test('renders one circle per metric', async () => {
  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMetric(5000)) })
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMetric(6)) })
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMetric(80)) });

  const { container } = render(<FitnessBreakdownChart />);
  await screen.findByTestId('fitness-rings');
  const circles = container.querySelectorAll('circle');
  expect(circles.length).toBe(3);
});

test('fetches metrics on mount', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

  render(<FitnessBreakdownChart />);
  const base = import.meta.env.VITE_BACKEND_URL;
  await screen.findByTestId('fitness-rings');
  expect(global.fetch).toHaveBeenCalledWith(`${base}/steps`);
  expect(global.fetch).toHaveBeenCalledWith(`${base}/sleep`);
  expect(global.fetch).toHaveBeenCalledWith(`${base}/heartrate`);
});
