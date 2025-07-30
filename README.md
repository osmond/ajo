testing vercel

# Garmin Activity Dashboard

This project contains a minimal React frontend that displays activity data on
charts and maps. All example GPS tracks are centered around **Madison,
Wisconsin** and are generated in the browser.

The app previously included a FastAPI backend but now ships with a mock API
implemented in `frontend/src/mockApi.js`. If `VITE_BACKEND_URL` is empty or set
to `"mock"`, the API helpers return data from this mock implementation instead
of fetching from a server.
### Install Dependencies

Before running the tests, install the Node packages:

```bash
cd frontend && npm install
```

## Running Frontend Tests

Execute Vitest once from the frontend directory. Make sure to install the
dependencies first so that Vitest is available:

```bash
cd frontend
npm install  # installs dependencies including devDependencies
npm test     # runs vitest once and then exits
```

All development tools such as Vitest are listed in `frontend/package.json` under
`devDependencies`.

## Configuration

The frontend reads `VITE_BACKEND_URL` from an `.env` file. When this value is
empty or set to `mock`, the app uses the built‑in mock API. Set it to a real
backend URL if you want to fetch data from a server.

## Frontend Features

The map section now displays a heatmap of all recorded routes. Filter by
activity type or date range to explore your workouts.

The "Mileage" tab visualizes your cumulative distance per month in a line chart.

The Activity Calendar displays a mini heatmap with one square per day. Days with
runs or recorded steps are colored by their total distance so busier days appear
darker.

## Tailwind Theme Setup

The `src/main.jsx` entry point imports `@/index.css` which includes `tailwindcss-shadcn-ui/style.css` so shadcn/ui component styles are loaded. The interface uses icons from the **Lucide** set via the `lucide-react` package.

The preset is enabled in `tailwind.config.js` via `createPreset` to load the component styles and map colors to CSS variables:

```js
const { createPreset } = require("tailwindcss-shadcn-ui");

module.exports = {
  presets: [
    createPreset(),
  ],
};
```

## Runs Endpoint

The backend exposes `GET /runs` to summarize run activities. Each item in the
returned JSON array includes:

- `date` – the local start date in `YYYY-MM-DD` format
- `distance` – total distance in meters
- `duration` – run duration in seconds
- `elevationGain` – ascent in meters

These values are generated from Garmin data when credentials are provided or
from dummy tracks otherwise.

## Summary Card

The Summary Card shown at the top of the app is implemented in
`frontend/src/components/WeeklySummaryCard.jsx`. It fetches step counts, sleep
hours and daily totals using the API helpers. A small "Activity Overview" heading
now sits above the card on the dashboard. The card header itself offers a date
range selector, quick filter buttons and export/share actions while the metrics
and sparklines sit in the card content below.

