import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RouteGlobe from '../RouteGlobe';

vi.mock('react-globe.gl', () => ({ default: (props) => <div data-testid="globe" {...props} /> }));

it('renders a Globe when points provided', () => {
  const pts = [
    { lat: 0, lon: 0 },
    { lat: 1, lon: 1 },
  ];
  render(<RouteGlobe points={pts} />);
  expect(screen.getByTestId('globe')).toBeInTheDocument();
});
