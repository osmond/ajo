import { fetchRuns, fetchActivities, fetchAnalysis } from '../../api';
import { vi } from 'vitest';

afterEach(() => vi.restoreAllMocks());

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

test('fetchActivities adds query string with leading ? when params provided', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  });

  await fetchActivities({ type: 'run' });
  const base = import.meta.env.VITE_BACKEND_URL;
  expect(global.fetch).toHaveBeenCalledWith(`${base}/activities?type=run`);
});

test('fetchAnalysis adds query string when params provided', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  });

  await fetchAnalysis({ start: '2023-01-01', end: '2023-02-01' });
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  expect(global.fetch).toHaveBeenCalledWith(
    `${baseUrl}/analysis?start=2023-01-01&end=2023-02-01`
  );
});

test('whitespace in VITE_BACKEND_URL is trimmed for mock mode', async () => {
  import.meta.env.VITE_BACKEND_URL = 'mock \n';
  vi.resetModules();
  const { fetchSteps } = await import('../../api');
  global.fetch = vi.fn();
  const result = await fetchSteps();
  expect(global.fetch).not.toHaveBeenCalled();
  expect(Array.isArray(result)).toBe(true);
  import.meta.env.VITE_BACKEND_URL = 'test';
});

test('quotes in VITE_BACKEND_URL are stripped for mock mode', async () => {
  import.meta.env.VITE_BACKEND_URL = '"mock"';
  vi.resetModules();
  const { fetchSteps } = await import('../../api');
  global.fetch = vi.fn();
  const result = await fetchSteps();
  expect(global.fetch).not.toHaveBeenCalled();
  expect(Array.isArray(result)).toBe(true);
  import.meta.env.VITE_BACKEND_URL = 'test';
});
