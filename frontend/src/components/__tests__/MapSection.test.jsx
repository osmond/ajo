import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import MapSection from '../MapSection';

afterEach(() => vi.restoreAllMocks());

vi.mock('../ActivityCalendar', () => ({ default: () => <div data-testid="calendar" /> }));
vi.mock('../CalendarHeatmap', () => ({ default: () => <div data-testid="heatmap" /> }));
vi.mock('../LeafletMap', () => ({ default: () => <div data-testid="leaflet" /> }));
vi.mock('../RouteHeatmap', () => ({ default: () => <div data-testid="routeheat" /> }));
vi.mock('../ElevationChart', () => ({ default: () => <div data-testid="elev" /> }));

it('loads the most recent activity on mount', async () => {
  global.fetch = vi.fn((url) => {
    if (url === '/activities/by-date') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            '2023-01-01': [{ activityId: 'a1', lat: 0, lon: 0 }],
            '2023-01-02': [{ activityId: 'a2', lat: 0, lon: 0 }],
          }),
      });
    }
    if (url === '/activities/a2/track') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ lat: 0, lon: 0 }]),
      });
    }
    if (url.startsWith('/routes')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  });

  render(<MapSection />);
  await waitFor(() => expect(screen.getByTestId('leaflet')).toBeInTheDocument());
  expect(global.fetch).toHaveBeenCalledWith('/activities/by-date');
  expect(global.fetch).toHaveBeenCalledWith('/activities/a2/track');
});
