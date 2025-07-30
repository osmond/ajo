import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import TimeCapsule from '../TimeCapsule';
import { fetchDailyTotals } from '../../api';

vi.mock('../../api', () => ({
  fetchDailyTotals: vi.fn(),
}));

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

it('shows latest month by default', async () => {
  fetchDailyTotals.mockResolvedValue([
    { date: '2023-03-01', distance: 1000, duration: 0 },
    { date: '2023-03-02', distance: 2000, duration: 0 },
    { date: '2023-04-01', distance: 1000, duration: 0 },
    { date: '2023-04-02', distance: 3000, duration: 0 },
  ]);

  render(<TimeCapsule />);

  await waitFor(() => expect(fetchDailyTotals).toHaveBeenCalled());
  await screen.findByText('April 2023 - 4.0 km');
});
