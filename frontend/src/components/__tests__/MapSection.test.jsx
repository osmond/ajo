import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import MapSection from '../MapSection';

afterEach(() => vi.restoreAllMocks());


vi.mock('../ActivityCalendar', () => ({ default: () => <div data-testid="calendar" /> }));
vi.mock('../CalendarHeatmap', () => ({ default: () => <div data-testid="heatmap" /> }));
vi.mock('../LeafletMap', () => ({ default: () => <div data-testid="leaflet" /> }));
vi.mock('../ElevationChart', () => ({ default: () => <div data-testid="elev" /> }));


it('fetches routes on mount', async () => {
  global.fetch = vi.fn((url) => {
    if (url.startsWith('/routes')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ lat: 0, lon: 0 }]),
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  });

  render(<MapSection />);
  await waitFor(() => expect(screen.getByTestId('routeheat')).toBeInTheDocument());
  expect(global.fetch).toHaveBeenCalledWith('/routes');
});
