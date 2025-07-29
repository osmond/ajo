from backend.app.main import app
from fastapi import FastAPI
from fastapi.responses import JSONResponse

# Create FastAPI app
app = FastAPI()

# Dummy data for now - replace with your real backend logic
@app.get("/steps")
def get_steps():
    return JSONResponse({
        "steps": [6500, 7200, 8300, 9000, 7500, 8100, 7005]
    })

@app.get("/sleep")
def get_sleep():
    return JSONResponse({
        "sleep_hours": [7.2, 6.8, 8.0, 7.5, 7.0, 7.8, 8.1]
    })

@app.get("/heartrate")
def get_heartrate():
    return JSONResponse({
        "heartrate": [65, 70, 68, 72, 69, 71, 67]
    })

# Health check route
@app.get("/")
def root():
    return {"message": "API is live"}
