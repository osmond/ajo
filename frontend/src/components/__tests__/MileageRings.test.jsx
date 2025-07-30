import { render, screen } from '@testing-library/react';
import MileageRings from '../MileageRings';
import { vi } from 'vitest';

afterEach(() => vi.restoreAllMocks());

beforeAll(() => {
  global.ResizeObserver = class {
    constructor(cb) { this.cb = cb; }
    observe() { this.cb([{ contentRect: { width: 80, height: 80 } }]); }
    unobserve() {}
    disconnect() {}
  };
  HTMLElement.prototype.getBoundingClientRect = () => ({
    width: 80,
    height: 80,
    top: 0,
    left: 0,
    bottom: 80,
    right: 80,
  });
});

function makeTotals(dist) {
  const totals = [];
  const start = new Date('2023-01-01');
  for (let i = 0; i < 7; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    totals.push({ date: d.toISOString().split('T')[0], distance: dist, duration: 0 });
  }
  return totals;
}

it('renders rings grouped by week', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(makeTotals(5000)),
  });

  render(<MileageRings goalKm={40} weeksToShow={1} />);
  const ring = await screen.findByTitle(/Week of/);
  expect(ring).toBeInTheDocument();
  const base = import.meta.env.VITE_BACKEND_URL;
  expect(global.fetch).toHaveBeenCalledWith(`${base}/daily-totals`);
});

it('shows check icon when goal met', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(makeTotals(10000)),
  });

  const { container } = render(<MileageRings goalKm={50} weeksToShow={1} />);
  await screen.findByTitle(/Week of/);
  const icon = container.querySelector('svg.lucide-check');
  expect(icon).toBeInTheDocument();
});
