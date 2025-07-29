import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import TimeOfDay from '../TimeOfDay';

vi.mock('react-chartjs-2', () => ({
  Scatter: (props) => <canvas data-testid="scatter" />,
}));

it('renders scatter plot for runs', async () => {
  const acts = [
    { startTimeLocal: '2023-01-01T06:30:00', activityType: { typeKey: 'run' } },
    { startTimeLocal: '2023-01-02T18:45:00', activityType: { typeKey: 'run' } },
  ];
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(acts),
  });

  render(<TimeOfDay />);
  expect(await screen.findByTestId('scatter')).toBeInTheDocument();
});
