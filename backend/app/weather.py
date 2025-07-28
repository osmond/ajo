import datetime
from typing import Optional

import requests

API_URL = "https://api.open-meteo.com/v1/forecast"


def get_weather(lat: float, lon: float, timestamp: str) -> dict:
    """Return historical weather information for the given location/time.

    The function queries the public Open-Meteo API. If the request fails, a
    dictionary with ``temperature`` set to ``None`` is returned.
    """
    if isinstance(timestamp, datetime.datetime):
        dt = timestamp
    else:
        dt = datetime.datetime.fromisoformat(timestamp)

    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "temperature_2m,precipitation,windspeed_10m,relativehumidity_2m",
        "start_date": dt.date().isoformat(),
        "end_date": dt.date().isoformat(),
        "timezone": "UTC",
    }
    try:
        resp = requests.get(API_URL, params=params, timeout=5)
        resp.raise_for_status()
        data = resp.json().get("hourly", {})
        times = data.get("time", [])
        temps = data.get("temperature_2m", [])
        precip = data.get("precipitation", [])
        winds = data.get("windspeed_10m", [])
        humidity = data.get("relativehumidity_2m", [])
        for idx, t in enumerate(times):
            if t.startswith(dt.strftime("%Y-%m-%dT%H")):
                return {
                    "temperature": temps[idx] if idx < len(temps) else None,
                    "precipitation": precip[idx] if idx < len(precip) else None,
                    "windspeed": winds[idx] if idx < len(winds) else None,
                    "humidity": humidity[idx] if idx < len(humidity) else None,
                }
    except Exception:
        pass
    return {"temperature": None, "precipitation": None, "windspeed": None, "humidity": None}
