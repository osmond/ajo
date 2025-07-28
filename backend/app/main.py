from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import datetime
import random
import os
from dotenv import load_dotenv
from .garmin_client import GarminClient

load_dotenv()
garmin_client = GarminClient()

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
    """Return activities from Garmin or dummy data."""
    if garmin_client.has_credentials:
        return garmin_client.get_activities(start, limit)
    return dummy_activities[start:start + limit]

@app.get("/activities/{activity_id}")
async def activity(activity_id: str):
    """Return detail for one activity."""
    if garmin_client.has_credentials:
        try:
            return garmin_client.get_activity(activity_id)
        except KeyError:
            raise HTTPException(status_code=404, detail="Activity not found")

    for act in dummy_activities:
        if act["activityId"] == activity_id:
            return {
                **act,
                "distance": 5000 + len(activity_id) * 10,
                "duration": 1800,
                "calories": 300,
                "type": "Run",
                "startTimeLocal": act["startTimeLocal"],
            }
    raise HTTPException(status_code=404, detail="Activity not found")


def _metric_points(count: int, start: datetime.datetime, delta: datetime.timedelta, low: int, high: int):
    """Helper to generate metric points"""
    points = []
    for i in range(count):
        ts = (start + delta * i).isoformat()
        value = random.randint(low, high)
        points.append({"timestamp": ts, "value": value})
    return points


@app.get("/steps")
async def steps():
    """Return daily step counts."""
    if garmin_client.has_credentials:
        return garmin_client.get_steps()
    now = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) - datetime.timedelta(days=6)
    return _metric_points(7, now, datetime.timedelta(days=1), 3000, 12000)


@app.get("/heartrate")
async def heartrate():
    """Return heart rate values."""
    if garmin_client.has_credentials:
        return garmin_client.get_heartrate()
    now = datetime.datetime.now() - datetime.timedelta(hours=23)
    return _metric_points(24, now, datetime.timedelta(hours=1), 60, 160)


@app.get("/vo2max")
async def vo2max():
    """Return VO2 max measurements."""
    if garmin_client.has_credentials:
        return garmin_client.get_vo2max()
    start = datetime.datetime.now() - datetime.timedelta(weeks=9)
    return _metric_points(10, start, datetime.timedelta(weeks=1), 40, 55)


@app.get("/sleep")
async def sleep():
    """Return nightly sleep duration in hours."""
    if garmin_client.has_credentials:
        return garmin_client.get_sleep()
    now = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) - datetime.timedelta(days=6)
    # Sleep hours scaled in minutes but stored as float hours
    points = _metric_points(7, now, datetime.timedelta(days=1), 5, 9)
    for p in points:
        p["value"] = float(p["value"])
    return points


@app.get("/map")
async def map_endpoint():
    """Return map metric data."""
    if garmin_client.has_credentials:
        return garmin_client.get_map()
    start = datetime.datetime.now() - datetime.timedelta(minutes=19)
    return _metric_points(20, start, datetime.timedelta(minutes=1), 0, 100)
