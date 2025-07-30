import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import DashboardTabs from '../DashboardTabs';

afterEach(() => vi.restoreAllMocks());

vi.mock('../WeeklySummaryCard', () => ({ default: ({ children }) => <div>{children}</div> }));
vi.mock('../StreakFlame', () => ({ default: () => <div /> }));
vi.mock('../KPIGrid', () => ({ default: () => <div /> }));
vi.mock('../FitnessScoreDial', () => ({ default: () => <div /> }));
vi.mock('../TemperatureChart', () => ({ default: () => <div /> }));
vi.mock('../WeatherChart', () => ({ default: () => <div /> }));
vi.mock('../WeeklyRingsDashboard', () => ({ default: () => <div /> }));
vi.mock('../AnalysisSection', () => ({ default: () => <div /> }));
vi.mock('../MapSection', () => ({ default: () => <div data-testid="map-section" /> }));
vi.mock('../VirtualPathMap', () => ({ default: () => <div data-testid="virtual-map" /> }));

it('shows map components when Maps tab selected', async () => {
  render(<DashboardTabs />);
  await userEvent.click(screen.getByRole('button', { name: /maps/i }));
  expect(await screen.findByTestId('map-section')).toBeInTheDocument();
  expect(screen.getByTestId('virtual-map')).toBeInTheDocument();
});
