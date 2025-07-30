# Garmin Activity Dashboard

This project contains a minimal React frontend and FastAPI backend used to mock
Garmin activity data. The frontend uses Vite and Tailwind CSS while the backend
serves dummy endpoints. All example GPS data is centered around **Madison, Wisconsin**.

We use **Python&nbsp;3** on the backend and a Node/Vite stack on the frontend.
On macOS with Homebrew‑managed Python you cannot install packages system‑wide
with plain `pip3`, so all backend dependencies are installed inside a virtual
environment.

## Local Development

1. **Backend (FastAPI)**
   ```bash
   # 1. create & enter your venv
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate          # (or `. .venv/bin/activate`)

   # 2. upgrade pip & install deps
   pip install --upgrade pip
   pip install -r requirements.txt

   # 3. make sure uvicorn is installed
   #    (uvicorn is in requirements.txt, so pip install -r should have put it in .venv)

   # 4. run the server
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env  # contains VITE_BACKEND_URL
   npm run dev
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

The frontend expects `VITE_BACKEND_URL` to point at the FastAPI server.
The provided `frontend/.env.example` file sets this to
`http://localhost:8000` for local development.

## Deploying to Vercel

Create a new project in Vercel and set the **root directory** to `frontend`.
Add the `VITE_BACKEND_URL` environment variable in the Vercel dashboard so the
frontend knows where to reach your backend. Vercel will run `npm run build` and
serve the generated static files from `frontend/dist`.

The backend can be hosted separately on any platform that supports FastAPI. For
one‑repo deployments you may also place a FastAPI app inside the `api/` folder
and include a `vercel.json` file that rewrites paths such as `/steps` or
`/activities` to that serverless function.

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

