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
