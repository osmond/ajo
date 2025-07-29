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
  const square = await screen.findByTitle(/2023-01-01/);
  expect(square.getAttribute('title')).toMatch('2023-01-01');
  expect(await screen.findAllByTitle(/2023-01-0[12]/)).toHaveLength(2);
});
