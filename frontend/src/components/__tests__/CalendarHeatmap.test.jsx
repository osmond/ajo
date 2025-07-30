import { render, screen } from '@testing-library/react';
import CalendarHeatmap from '../CalendarHeatmap';
import { vi } from 'vitest';

afterEach(() => vi.restoreAllMocks());

it('renders squares with tooltip text', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve([
        { date: '2023-01-01', distance: 5000, duration: 1800 },
        { date: '2023-01-02', distance: 6000, duration: 1900 },
      ]),
  });

  render(<CalendarHeatmap />);
  const squares = await screen.findAllByTestId('heatmap-square');
  expect(squares).toHaveLength(2);
  expect(squares[0]).toHaveAttribute('aria-label', expect.stringContaining('2023-01-01'));
});
