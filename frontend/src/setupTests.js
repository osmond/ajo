import '@testing-library/jest-dom';

if (!import.meta.env) {
  // Vitest injects import.meta.env but ensure it exists for older versions
  import.meta.env = {};
}
// Use fetch-based API calls during tests
import.meta.env.VITE_BACKEND_URL = 'test';
