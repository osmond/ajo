import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatesTable from '../StatesTable';

function firstRow(container) {
  return container.querySelector('tbody tr');
}

it('sorts by miles descending by default', () => {
  const { container } = render(<StatesTable />);
  expect(firstRow(container)).toHaveTextContent('Wisconsin');
});

it('sorts by days when header clicked', async () => {
  const { container } = render(<StatesTable />);
  await userEvent.click(screen.getAllByText('DAYS')[0]);
  expect(firstRow(container)).toHaveTextContent('California');
});

it('toggles sort direction on repeated click', async () => {
  const { container } = render(<StatesTable />);
  const header = screen.getAllByText('DAYS')[0];
  await userEvent.click(header); // desc
  await userEvent.click(header); // asc
  expect(firstRow(container)).toHaveTextContent('Delaware');
});
