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

The frontend reads `VITE_BACKEND_URL` from an `.env` file. A sample is provided
at `frontend/.env.example`:

```bash
VITE_BACKEND_URL=mock
```

Copy this file to `.env` if you want to run the demo with the bundled mock API.
When the variable is empty or set to `mock`, the app loads data from the mock
implementation. Set it to a real backend URL if you need to fetch data from a
server.

## Frontend Features

The map section now displays a heatmap of all recorded routes. Filter by
activity type or date range to explore your workouts.

The "Mileage" tab visualizes your cumulative distance per month in a line chart.

The Activity Calendar displays a mini heatmap with one square per day. Days with
runs or recorded steps are colored by their total distance so busier days appear
darker.

The 3D route viewer now includes a globe option. Use the dropdown above the
viewer to switch between the traditional 3D track and a rotating earth view.

All of the map-based views are grouped under a new **Maps** tab, bringing the
route viewer, timeline and virtual path tracker together in one place.

Navigation links for **Dashboard**, **Charts**, **Maps** and **Components** now
appear in a persistent top bar with the site title on the left so you can switch
pages at any time.

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

## Summary Card
The Summary Card shown at the top of the app is implemented in
`frontend/src/components/WeeklySummaryCard.jsx`. It fetches step counts, sleep
hours and daily totals using the API helpers. A small "Activity Overview" heading
now sits above the card on the dashboard. The card header itself offers a date
range selector, quick filter buttons and export/share actions while the metrics
and sparklines sit in the card content below.
## Weekly Rings Dashboard
A dedicated page visualizes recent mileage with animated progress rings. Each circle now splits running and cycling distance into color-coded arcs so you can quickly compare bike and run mileage for the week.

Open `http://localhost:5173/rings` after starting the dev server to see this dashboard. It uses the same `VITE_BACKEND_URL` setting as the rest of the app and needs no extra setup.

hi
## Deployment
The project is configured for Vercel with the project root set to `frontend/`. The build command is `npm run build` and the output is generated in the `dist` directory.

### Development
Start the dev server from the frontend folder:

```bash
cd frontend && npm run dev
```

