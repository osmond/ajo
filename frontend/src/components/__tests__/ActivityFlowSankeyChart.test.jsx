import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ActivityFlowSankeyChart, { computeActivityFlows } from '../ActivityFlowSankeyChart';

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

test('computeActivityFlows aggregates transitions', () => {
  const acts = [
    { startTimeLocal: '2023-01-01T08:00:00' },
    { startTimeLocal: '2023-01-02T18:00:00' },
    { startTimeLocal: '2023-01-03T07:00:00' },
  ];
  const { nodes, links } = computeActivityFlows(acts);
  const names = nodes.map(n => n.name);
  const lookup = {};
  links.forEach(l => {
    const s = names[l.source];
    const t = names[l.target];
    lookup[`${s}-${t}`] = l.value;
  });
  expect(lookup['Morning-Evening']).toBe(1);
  expect(lookup['Weekend-Weekday']).toBe(1);
  expect(lookup['Evening-Morning']).toBe(1);
  expect(lookup['Weekday-Weekday']).toBe(1);
});

test('fetches activity data on mount', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  });

  render(<ActivityFlowSankeyChart />);
  const base = import.meta.env.VITE_BACKEND_URL;
  await waitFor(() =>
    expect(global.fetch).toHaveBeenCalledWith(`${base}/activities?limit=1000`)
  );
});
