import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import TimeCapsule from '../TimeCapsule';

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

test('opens newest month after fetching totals', async () => {
  const totals = [
    { date: '2023-01-15', distance: 1000, duration: 0 },
    { date: '2023-02-20', distance: 2000, duration: 0 },
  ];

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(totals),
  });

  render(<TimeCapsule />);

  const detail = await screen.findByText(/February 2023/);
  expect(detail.textContent).toMatch(/2\.0 km/);
});
