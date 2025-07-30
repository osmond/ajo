import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import FitnessScoreDial from '../FitnessScoreDial';

afterEach(() => vi.restoreAllMocks());

test('renders legend labels after loading', async () => {
  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ timestamp: '2023-01-01', value: 5000 }]) })
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ timestamp: '2023-01-01', value: 80 }]) })
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ timestamp: '2023-01-01', value: 7 }]) });

  render(<FitnessScoreDial />);
  await screen.findByTestId('score-legend');
  expect(screen.getByText('Poor')).toBeInTheDocument();
  expect(screen.getByText('Average')).toBeInTheDocument();
  expect(screen.getByText('Great')).toBeInTheDocument();
});
