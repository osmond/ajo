import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CumulativeChart from '../CumulativeChart';

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

it('renders cumulative mileage points', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve([
        { date: '2023-01-01', distance: 1000, duration: 0 },
        { date: '2023-01-05', distance: 2000, duration: 0 },
        { date: '2023-02-01', distance: 3000, duration: 0 },
      ]),
  });

  render(<CumulativeChart />);
  const dots = await screen.findAllByTitle(/2023-(01|02)/);
  const titles = dots.map((d) => d.getAttribute('title'));
  expect(titles).toEqual(['2023-01: 3.0 km', '2023-02: 6.0 km']);
});
