import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import VirtualPathMap from '../VirtualPathMap';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  Polyline: () => <div data-testid="polyline" />,
  Marker: ({ children, ...props }) => <div data-testid="progress-marker" {...props}>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
}));

afterEach(() => vi.restoreAllMocks());

it('fetches totals and shows marker', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([
      { date: '2024-01-01', distance: 1000, duration: 0 },
    ]),
  });

  render(<VirtualPathMap />);

  await waitFor(() => expect(screen.getByTestId('progress-marker')).toBeInTheDocument());
  expect(global.fetch).toHaveBeenCalledWith('/daily-totals');
});
