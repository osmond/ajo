import { render, waitFor } from '@testing-library/react';
import RunHeatmap from '../RunHeatmap';
import { vi } from 'vitest';

it('renders rects with tooltip data', async () => {
  const d1 = new Date();
  const d0 = new Date(Date.now() - 86400000);
  const fmt = (d) => d.toISOString().split('T')[0];
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve([
        { date: fmt(d0), distance: 1609, duration: 1800 },
        { date: fmt(d1), distance: 3218, duration: 1800 },
      ]),
  });

  const { container } = render(<RunHeatmap />);
  await waitFor(() => {
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
  });
  const rect = container.querySelector(`rect[data-tip*="${fmt(d0)}"]`);
  expect(rect).not.toBeNull();
});
