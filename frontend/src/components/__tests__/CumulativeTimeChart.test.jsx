import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CumulativeTimeChart from '../CumulativeTimeChart';

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

it('renders cumulative time points', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve([
        { date: '2023-01-01', distance: 0, duration: 1800 },
        { date: '2023-01-05', distance: 0, duration: 1800 },
        { date: '2023-02-01', distance: 0, duration: 3600 },
      ]),
  });

  render(<CumulativeTimeChart />);
  const dots = await screen.findAllByTitle(/2023-(01|02)/);
  const titles = dots.map((d) => d.getAttribute('title'));
  expect(titles).toEqual(['2023-01: 1.0 h', '2023-02: 2.0 h']);
});
