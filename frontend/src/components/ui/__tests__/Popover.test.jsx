import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverTrigger, PopoverContent } from '../Popover';

test('shows content when trigger clicked', async () => {
  render(
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Content</PopoverContent>
    </Popover>
  );
  expect(screen.queryByText('Content')).not.toBeInTheDocument();
  await userEvent.click(screen.getByText('Open'));
  expect(screen.getByText('Content')).toBeInTheDocument();
});
