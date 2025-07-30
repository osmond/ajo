# Dummy Garmin Official API Backend

This backend serves dummy data until real Garmin credentials are available.
The generated activities are located around **Madison, Wisconsin** for use in the demo maps.

## Setup

1. Copy `.env.example` to `.env` when you have Garmin API credentials.
   Fill in the following variables:
   - `GC_CONSUMER_KEY`
   - `GC_CONSUMER_SECRET`
   - `GC_OAUTH_TOKEN`
   - `GC_OAUTH_TOKEN_SECRET`
2. Install dependencies inside a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Running Tests

To execute the backend unit tests use `pytest`:

```bash
cd backend
pytest
```

When the credentials are provided, the server will use them to query Garmin
for activity data. If no credentials are set, all endpoints continue to return
the built-in dummy responses.

## Endpoints

The API exposes several dummy routes returning JSON data:

- `GET /activities` – list recent activities (optional `type` query param filters by activity type)
- `GET /activities/by-date` – activities grouped by date with start coordinates
- `GET /activities/{activity_id}` – detail for a specific activity
- `GET /steps` – daily step counts
- `GET /heartrate` – hourly heart rate samples
- `GET /vo2max` – weekly VO2 max values
- `GET /sleep` – nightly sleep duration in hours
- `GET /map` – miscellaneous map metric points
