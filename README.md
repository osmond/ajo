testing vercel

# Garmin Activity Dashboard

This project contains a minimal React frontend and FastAPI backend used to mock
Garmin activity data. The frontend uses Vite and Tailwind CSS while the backend
serves dummy endpoints. All example GPS data is centered around **Madison, Wisconsin**.

The repository includes two FastAPI entry points:

- **`/backend`** – the full app used when developing locally with Uvicorn
- **`/api`** – a lightweight wrapper for Vercel serverless deployment

Both point to the same code in `backend/app`. Local development runs the app in
`backend/app/main.py`, while Vercel imports that module through `api/index.py`.

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
   pip install -r ../api/requirements.txt

   # 3. make sure uvicorn is installed
   #    (uvicorn is in ../api/requirements.txt, so pip install -r should have put it in .venv)

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
### Install Dependencies

Before running the tests, install the Python and Node packages:

```bash
pip install -r api/requirements.txt
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

The frontend expects `VITE_BACKEND_URL` to point at the FastAPI server.
The provided `frontend/.env.example` file sets this to
`http://localhost:8000` for local development.

## Deploying to Vercel

This repository is organised as a small monorepo:

- `/frontend` – React + Vite frontend
- `/backend` – full FastAPI app for local development
- `/api` – minimal entry point for Vercel serverless deployment

### 1. Vercel Project Settings
Set the project root to `./` and build the frontend with:

```bash
cd frontend && npm install && npm run build
```

The output directory is `frontend/dist`.

### 2. Environment Variables
Add the following variable in the Vercel dashboard:

```ini
VITE_BACKEND_URL=/api
```

### 3. `vercel.json`
API routes are configured through `vercel.json` and run on Python&nbsp;3.11:

```json
{
  "version": 2,
  "functions": {
    "api/**/*.py": { "runtime": "python3.11" }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.py" }
  ]
}
```

### 4. Local Development
Run the backend and frontend separately:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

and

```bash
cd frontend
npm run dev
```

`frontend/.env.example` already sets:

```ini
VITE_BACKEND_URL=http://localhost:8000
```

When deployed, all API requests go through `/api`.
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

