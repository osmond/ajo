import { render } from '@testing-library/react'
import { TodayDistanceSparkbar } from '../TodayDistanceSparkbar'

beforeAll(() => {
  global.ResizeObserver = class {
    constructor(cb) {
      this.cb = cb
    }
    observe() {
      this.cb([{ contentRect: { width: 120, height: 32 } }])
    }
    unobserve() {}
    disconnect() {}
  }
  HTMLElement.prototype.getBoundingClientRect = () => ({
    width: 120,
    height: 32,
    top: 0,
    left: 0,
    bottom: 32,
    right: 120,
  })
})

it('renders sparkbar svg', () => {
  const data = [1,2,3,4,5,6,7,8]
  const { container } = render(
    <TodayDistanceSparkbar history={data} todayValue={8} />
  )
  expect(container.querySelector('svg')).toBeInTheDocument()
})
