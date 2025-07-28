# Garmin Activity Dashboard

This project contains a minimal React frontend and FastAPI backend used to mock
Garmin activity data. The frontend uses Vite and Tailwind CSS while the backend
serves dummy endpoints.

## Local Development

1. **Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
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

Execute Vitest from the frontend directory:

```bash
cd frontend
npm test
```

## Configuration

The frontend expects `VITE_BACKEND_URL` to point at the FastAPI server. When
running locally this defaults to `http://localhost:8000`.

## Deploying to Vercel

Create a new project in Vercel and set the **root directory** to `frontend`.
Add the `VITE_BACKEND_URL` environment variable in the Vercel dashboard so the
frontend knows where to reach your backend. Vercel will run `npm run build` and
serve the generated static files from `frontend/dist`.

The backend can be hosted separately on any platform that supports FastAPI.
