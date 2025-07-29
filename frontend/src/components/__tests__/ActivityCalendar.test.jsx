import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityCalendar from '../ActivityCalendar';
import { vi } from 'vitest';

afterEach(() => vi.restoreAllMocks());

it('renders month view and triggers selection', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        '2023-01-01': [{ activityId: 'a1', lat: 0, lon: 0 }],
      }),
  });

  const handler = vi.fn();
  render(<ActivityCalendar onSelect={handler} />);

  const btn = await screen.findByRole('button', { name: '1' });
  await userEvent.click(btn);
  expect(handler).toHaveBeenCalledWith({ activityId: 'a1', lat: 0, lon: 0 });
});

it('shows empty days but they are not selectable', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        '2023-01-02': [{ activityId: 'b1', lat: 0, lon: 0 }],
      }),
  });

  render(<ActivityCalendar onSelect={() => {}} />);

  await screen.findByText('1'); // ensure day 1 rendered
  expect(screen.queryByRole('button', { name: '1' })).toBeNull();
});
