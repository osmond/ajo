import { render, screen } from '@testing-library/react';
import DailyHeatmap from '../DailyHeatmap';
import { vi } from 'vitest';

it('renders heatmap squares', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve([
        { date: '2023-01-01', distance: 5000, duration: 1800 },
        { date: '2023-01-02', distance: 6000, duration: 1900 },
      ]),
  });

  render(<DailyHeatmap />);
  const squares = await screen.findAllByTitle(/2023-01-0[12]/);
  expect(squares).toHaveLength(2);
});
