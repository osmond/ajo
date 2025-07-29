import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import TodayDistanceCard from '../TodayDistanceCard'

afterEach(() => vi.restoreAllMocks())

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

it('renders sparkbar from API data', async () => {
  const totals = Array.from({ length: 8 }).map((_, i) => ({
    date: `2023-01-0${i + 1}`,
    distance: i * 1000,
    duration: 0,
  }))
  global.fetch = vi.fn((url) => {
    if (url === '/daily-totals') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(totals) })
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  })
  const { container } = render(<TodayDistanceCard />)
  await screen.findByText('Distance Today')
  await waitFor(() => {
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
