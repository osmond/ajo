import { render } from '@testing-library/react';
import ProgressRing from '../ProgressRing';

it('renders two circles and applies correct offset', () => {
  const { container } = render(<ProgressRing value={50} max={100} size={100} stroke={10} />);
  const circles = container.querySelectorAll('circle');
  expect(circles).toHaveLength(2);
  const radius = (100 - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const expectedOffset = circumference - (50 / 100) * circumference;
  expect(parseFloat(circles[1].getAttribute('stroke-dashoffset'))).toBeCloseTo(expectedOffset);
});
