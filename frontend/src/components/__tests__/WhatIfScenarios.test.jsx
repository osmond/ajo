import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  const data = makeData(8, 25, 50, 0);
  expect(data).toHaveLength(7);
  // first day pace slightly lower due to deterministic offset
  expect(data[0].pace).toBeCloseTo(5.97);
});

test('sliders update displayed values', () => {
  const { container } = render(<WhatIfScenarios />);
  const sleepSlider = screen.getByTestId('sleep-slider');
  for (let i = 0; i < 4; i++) {
    fireEvent.keyDown(sleepSlider, { key: 'ArrowUp' });
  }
  const thumb = sleepSlider.querySelector('[role="slider"]');
  expect(thumb).toHaveAttribute('aria-valuenow', '9');
  expect(container.querySelector('svg')).toBeTruthy();
});

test('reset button restores defaults', async () => {
  render(<WhatIfScenarios />);
  const sleepSlider = screen.getByTestId('sleep-slider');
  for (let i = 0; i < 4; i++) {
    fireEvent.keyDown(sleepSlider, { key: 'ArrowUp' });
  }
  const thumb = sleepSlider.querySelector('[role="slider"]');
  expect(thumb).toHaveAttribute('aria-valuenow', '9');
  await userEvent.click(screen.getByRole('button', { name: /reset/i }));
  expect(thumb).toHaveAttribute('aria-valuenow', '7');
});

test('additional sliders render', () => {
  render(<WhatIfScenarios />);
  expect(screen.getByLabelText('Humidity')).toBeInTheDocument();
  expect(screen.getByLabelText('Elevation')).toBeInTheDocument();
});

test('runner avatar and trail are displayed', () => {
  render(<WhatIfScenarios />);
  expect(screen.getByTestId('runner')).toBeInTheDocument();
  expect(screen.getByTestId('trail')).toBeInTheDocument();
});
