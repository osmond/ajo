import { render } from '@testing-library/react';
import Route3D from '../Route3D';

test('renders nothing when no points provided', () => {
  const { container } = render(<Route3D points={[]} />);
  expect(container.firstChild).toBeNull();
});
