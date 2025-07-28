import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom doesn't implement matchMedia, but next-themes expects it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

vi.mock('@shadcn/ui', () => {
  const React = require('react')
  const Stub = ({ children, ...props }) => React.createElement('div', props, children)
  return {
    Button: (props) => React.createElement('button', props),
    Card: Stub,
    CardHeader: Stub,
    CardTitle: ({ children }) => React.createElement('h3', null, children),
    Tabs: Stub,
    TabsList: Stub,
    TabsTrigger: (props) => React.createElement('button', props),
    TabsContent: ({ children }) => React.createElement('div', null, children),
  }
})
