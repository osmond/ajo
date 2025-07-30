import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import MapSection from '../MapSection';

afterEach(() => vi.restoreAllMocks());


vi.mock('../ActivityCalendar', () => ({ default: () => <div data-testid="calendar" /> }));
vi.mock('../CalendarHeatmap', () => ({ default: () => <div data-testid="heatmap" /> }));
vi.mock('../LeafletMap', () => ({ default: () => <div data-testid="leaflet" /> }));
vi.mock('../ElevationChart', () => ({ default: () => <div data-testid="elev" /> }));
vi.mock('../Route3D', () => ({ default: () => <div data-testid="route3d" /> }));


it('fetches activity data on mount', async () => {
  global.fetch = vi.fn((url) => {
    if (url.startsWith('/activities/by-date')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ '2024-01-01': [{ activityId: '1' }] }),
      });
    }
    if (url.startsWith('/activities/1/track')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  });

  render(<MapSection />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/activities/by-date'));
  expect(global.fetch).toHaveBeenCalledWith('/activities/1/track');
});
