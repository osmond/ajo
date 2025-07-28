import { render } from '@testing-library/react';
import ProgressRing from '../ProgressRing';

beforeAll(() => {
  global.ResizeObserver = class {
    constructor(cb) {
      this.cb = cb;
    }
    observe() {
      this.cb([{ contentRect: { width: 80, height: 80 } }]);
    }
    unobserve() {}
    disconnect() {}
  };
  HTMLElement.prototype.getBoundingClientRect = () => ({
    width: 80,
    height: 80,
    top: 0,
    left: 0,
    bottom: 80,
    right: 80,
  });
});

it('renders radial bar chart and displays value', () => {
  const { container, getByText } = render(
    <ProgressRing value={50} max={100} size={80} />
  );
  // An svg element should be rendered for the chart
  expect(container.querySelector('svg')).toBeInTheDocument();
  // The numeric value should appear in the overlay
  expect(getByText('50')).toBeInTheDocument();
});
