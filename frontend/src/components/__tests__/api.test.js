import { fetchRuns } from '../../api';
import { vi } from 'vitest';

test('fetchRuns returns parsed JSON', async () => {
  const data = [
    { date: '2023-01-01', distance: 5000, duration: 1800 },
  ];
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });

  const result = await fetchRuns();
  expect(result).toEqual(data);
});
