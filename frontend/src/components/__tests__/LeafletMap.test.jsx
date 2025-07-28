import { render, screen } from '@testing-library/react';
import LeafletMap from '../LeafletMap';
import { vi } from 'vitest';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  Polyline: ({ pathOptions }) => (
    <div data-testid="polyline" data-color={pathOptions.color} />
  ),
  CircleMarker: () => null,
}));

delete window.L; // ensure no Leaflet global

const points = [
  { lat: 0, lon: 0, heartRate: 100, speed: 1 },
  { lat: 0, lon: 1, heartRate: 120, speed: 2 },
  { lat: 0, lon: 2, heartRate: 110, speed: 3 },
];

test('updates polyline colors when metric changes', () => {
  const { rerender } = render(<LeafletMap points={points} metricKey="heartRate" />);
  const hrColors = screen
    .getAllByTestId('polyline')
    .map((el) => el.getAttribute('data-color'));

  rerender(<LeafletMap points={points} metricKey="speed" />);
  const speedColors = screen
    .getAllByTestId('polyline')
    .map((el) => el.getAttribute('data-color'));

  expect(hrColors).not.toEqual(speedColors);
});

