import { render } from '@testing-library/react';
import { Progress } from '../Progress';

test('applies width style based on value', () => {
  const { container } = render(<Progress value={50} max={100} />);
  const bar = container.firstChild.firstChild;
  expect(bar.getAttribute('style')).toContain('width: 50%');
});
