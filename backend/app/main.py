from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import datetime

app = FastAPI(title="Dummy Garmin Activity API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy activities list
dummy_activities = [
    {"activityId": f"act_{i}", "activityType": {"typeKey": "RUN"}, "startTimeLocal": (datetime.datetime.now() - datetime.timedelta(days=i)).isoformat()}
    for i in range(1, 6)
]

@app.get("/activities")
async def activities(start: int = 0, limit: int = 50):
    """Return a slice of dummy activities."""
    return dummy_activities[start:start+limit]

@app.get("/activities/{activity_id}")
async def activity(activity_id: str):
    """Return dummy detail for one activity."""
    for act in dummy_activities:
        if act["activityId"] == activity_id:
            # add some dummy detail fields
            return {
                **act,
                "distance": 5000 + len(activity_id)*10,
                "duration": 1800,
                "calories": 300,
                "type": "Run",
                "startTimeLocal": act["startTimeLocal"]
            }
    raise HTTPException(status_code=404, detail="Activity not found")
