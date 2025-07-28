import { render } from '@testing-library/react';
import ElevationChart from '../ElevationChart';

beforeAll(() => {
  global.ResizeObserver = class {
    constructor(cb) {
      this.cb = cb;
    }
    observe() {
      this.cb([{ contentRect: { width: 100, height: 80 } }]);
    }
    unobserve() {}
    disconnect() {}
  };
  HTMLElement.prototype.getBoundingClientRect = () => ({
    width: 100,
    height: 80,
    top: 0,
    left: 0,
    bottom: 80,
    right: 100,
  });
});

const points = [
  { lat: 0, lon: 0, elevation: 100 },
  { lat: 0, lon: 1, elevation: 110 },
  { lat: 0, lon: 2, elevation: 120 },
];

test('renders reference dot when active index provided', () => {
  const { container } = render(
    <ElevationChart points={points} activeIndex={1} />
  );
  // ReferenceDot renders a circle element
  expect(container.querySelector('circle')).toBeInTheDocument();
});
