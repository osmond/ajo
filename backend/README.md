# Dummy Garmin Official API Backend

This backend serves dummy data until real Garmin credentials are available.

## Setup

1. (Optional) Copy `.env.example` to `.env` when you have credentials.
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the server:
   ```
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Endpoints

The API exposes several dummy routes returning JSON data:

- `GET /activities` – list recent activities
- `GET /activities/{activity_id}` – detail for a specific activity
- `GET /steps` – daily step counts
- `GET /heartrate` – hourly heart rate samples
- `GET /vo2max` – weekly VO2 max values
- `GET /sleep` – nightly sleep duration in hours
- `GET /map` – miscellaneous map metric points
