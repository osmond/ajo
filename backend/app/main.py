from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import datetime
import random
import os
from dotenv import load_dotenv
from .garmin_client import GarminClient
from .weather import get_weather

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
dummy_activities = []
base_lat, base_lon = 37.7749, -122.4194
for i in range(1, 6):
    dummy_activities.append(
        {
            "activityId": f"act_{i}",
            "activityType": {"typeKey": "RUN"},
            "startTimeLocal": (
                datetime.datetime.now() - datetime.timedelta(days=i)
            ).isoformat(),
            "startLat": base_lat + random.uniform(-0.02, 0.02),
            "startLon": base_lon + random.uniform(-0.02, 0.02),
        }
    )

@app.get("/activities")
async def activities(start: int = 0, limit: int = 50):
    """Return activities from Garmin or dummy data."""
    if garmin_client.has_credentials:
        return garmin_client.get_activities(start, limit)
    return dummy_activities[start:start + limit]


@app.get("/activities/by-date")
async def activities_by_date():
    """Return activities grouped by date with start coordinates."""
    if garmin_client.has_credentials:
        return garmin_client.get_activities_by_date()
    groups = {}
    for act in dummy_activities:
        date = act["startTimeLocal"].split("T")[0]
        entry = {
            "activityId": act["activityId"],
            "lat": act["startLat"],
            "lon": act["startLon"],
        }
        groups.setdefault(date, []).append(entry)
    return groups

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


@app.get("/activities/{activity_id}/track")
async def activity_track(activity_id: str):
    """Return GPS track for the activity."""
    if garmin_client.has_credentials:
        try:
            points = garmin_client.get_track(activity_id)
        except KeyError:
            raise HTTPException(status_code=404, detail="Activity not found")
    else:
        for act in dummy_activities:
            if act["activityId"] == activity_id:
                start = datetime.datetime.fromisoformat(act["startTimeLocal"])
                points = []
                lat = act.get("startLat", 37.7749)
                lon = act.get("startLon", -122.4194)
                for i in range(20):
                    ts = (start + datetime.timedelta(minutes=i)).isoformat()
                    points.append({
                        "timestamp": ts,
                        "lat": lat + i * 0.001,
                        "lon": lon + i * 0.001,
                        "heartRate": random.randint(60, 170),
                        "speed": round(random.uniform(2.5, 6.0), 2),
                    })
                break
        else:
            raise HTTPException(status_code=404, detail="Activity not found")

    if points:
        weather = get_weather(points[0]["lat"], points[0]["lon"], points[0]["timestamp"])
        for p in points:
            p["temperature"] = weather.get("temperature")
    return points


@app.get("/routes")
async def all_routes():
    """Return all GPS coordinates from stored activities."""
    coords = []
    if garmin_client.has_credentials:
        activities = garmin_client.get_activities()
        for act in activities:
            try:
                track = garmin_client.get_track(act["activityId"])
            except KeyError:
                continue
            coords.extend({"lat": p["lat"], "lon": p["lon"]} for p in track)
    else:
        for act in dummy_activities:
            start = datetime.datetime.fromisoformat(act["startTimeLocal"])
            lat = act.get("startLat", base_lat)
            lon = act.get("startLon", base_lon)
            for i in range(20):
                coords.append({"lat": lat + i * 0.001, "lon": lon + i * 0.001})
    return coords


@app.get("/daily-totals")
async def daily_totals():
    """Return daily distance and duration totals."""
    totals = {}
    if garmin_client.has_credentials:
        acts = garmin_client.get_activities()
        for act in acts:
            detail = garmin_client.get_activity(act["activityId"])
            date = detail["startTimeLocal"].split("T")[0]
            entry = totals.setdefault(date, {"distance": 0, "duration": 0})
            entry["distance"] += detail.get("distance", 0)
            entry["duration"] += detail.get("duration", 0)
    else:
        for act in dummy_activities:
            date = act["startTimeLocal"].split("T")[0]
            entry = totals.setdefault(date, {"distance": 0, "duration": 0})
            # dummy detail
            entry["distance"] += 5000 + len(act["activityId"]) * 10
            entry["duration"] += 1800
    return [{"date": d, **v} for d, v in sorted(totals.items())]


@app.get("/analysis")
async def analysis():
    """Return activity pace/HR vs temperature data."""
    acts = garmin_client.get_activities() if garmin_client.has_credentials else dummy_activities
    results = []
    for act in acts:
        # get track
        if garmin_client.has_credentials:
            try:
                track = garmin_client.get_track(act["activityId"])
            except KeyError:
                continue
        else:
            start = datetime.datetime.fromisoformat(act["startTimeLocal"])
            lat = act.get("startLat", base_lat)
            lon = act.get("startLon", base_lon)
            track = []
            for i in range(20):
                ts = (start + datetime.timedelta(minutes=i)).isoformat()
                track.append({
                    "timestamp": ts,
                    "lat": lat + i * 0.001,
                    "lon": lon + i * 0.001,
                    "heartRate": random.randint(60, 170),
                    "speed": round(random.uniform(2.5, 6.0), 2),
                })

        if not track:
            continue

        weather = get_weather(track[0]["lat"], track[0]["lon"], track[0]["timestamp"])
        temp = weather.get("temperature")
        avg_speed = sum(p["speed"] for p in track) / len(track)
        avg_hr = sum(p["heartRate"] for p in track) / len(track)
        pace = 1000.0 / (60 * avg_speed)
        results.append({
            "activityId": act["activityId"],
            "temperature": temp,
            "avgPace": round(pace, 2),
            "avgHeartRate": round(avg_hr, 1),
        })
    return results
