import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import TimelineMap from '../TimelineMap';
import { fetchActivitiesByDate, fetchActivityTrack } from '../../api';

vi.mock('react-horizontal-scrolling-menu', () => ({
  ScrollMenu: ({ children }) => <div data-testid="scroll">{children}</div>,
}));

vi.mock('../TrackMap', () => ({ default: () => <div data-testid="trackmap" /> }));
vi.mock('../../api', () => ({
  fetchActivitiesByDate: vi.fn(),
  fetchActivityTrack: vi.fn(),
}));

afterEach(() => vi.restoreAllMocks());

it('loads latest month and its tracks', async () => {
  fetchActivitiesByDate.mockResolvedValue({
    '2024-01-01': [{ activityId: '1' }],
    '2024-02-01': [{ activityId: '2' }],
  });
  fetchActivityTrack.mockResolvedValue([]);

  render(<TimelineMap />);

  await waitFor(() => expect(fetchActivitiesByDate).toHaveBeenCalled());
  expect(screen.getByRole('button', { name: /feb/i })).toBeInTheDocument();
  await waitFor(() => expect(fetchActivityTrack).toHaveBeenCalledWith('2'));
});
