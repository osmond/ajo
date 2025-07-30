import { render } from '@testing-library/react';
import { Calendar } from '../Calendar';

test('renders input element', () => {
  const { container } = render(<Calendar />);
  expect(container.querySelector('input[type="date"]')).toBeInTheDocument();
});
