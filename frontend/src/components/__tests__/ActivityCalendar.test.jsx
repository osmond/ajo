import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityCalendar from '../ActivityCalendar';
import { vi } from 'vitest';

it('renders dates and triggers selection', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        '2023-01-01': [{ activityId: 'a1', lat: 0, lon: 0 }],
      }),
  });

  const handler = vi.fn();
  render(<ActivityCalendar onSelect={handler} />);

  const btn = await screen.findByText('2023-01-01');
  await userEvent.click(btn);
  expect(handler).toHaveBeenCalledWith({ activityId: 'a1', lat: 0, lon: 0 });
});
