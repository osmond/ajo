import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import WeatherImpactBubbleChart from '../WeatherImpactBubbleChart';

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

test('renders scatter bubbles based on analysis data and passes dates', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve([
        { activityId: '1', temperature: 10, avgHeartRate: 150, distance: 5000 },
      ]),
  });

  const start = '2023-01-01';
  const end = '2023-01-31';
  const { container } = render(
    <WeatherImpactBubbleChart start={start} end={end} />
  );
  await waitFor(() => {
    const symbols = container.querySelectorAll('path.recharts-symbols');
    expect(symbols.length).toBeGreaterThan(0);
  });
  expect(global.fetch).toHaveBeenCalledWith(
    `/analysis?start=${start}&end=${end}`
  );
});
