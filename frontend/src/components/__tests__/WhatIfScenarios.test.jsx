import { render, screen, fireEvent } from '@testing-library/react';
import WhatIfScenarios, { makeData } from '../WhatIfScenarios';
import { vi } from 'vitest';

afterEach(() => vi.restoreAllMocks());

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

test('makeData produces 7 days of pace data', () => {
  const data = makeData(8, 25);
  expect(data).toHaveLength(7);
  // first day pace slightly lower due to deterministic offset
  expect(data[0].pace).toBeCloseTo(5.97);
});

test('sliders update displayed values', () => {
  const { container } = render(<WhatIfScenarios />);
  const sleepSlider = screen.getByTestId('sleep-slider');
  fireEvent.change(sleepSlider, { target: { value: '9' } });
  expect(screen.getByText(/Sleep: 9/)).toBeInTheDocument();
  expect(container.querySelector('svg')).toBeTruthy();
});
