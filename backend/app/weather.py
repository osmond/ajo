import datetime
from typing import Dict, Tuple

import requests

API_URL = "https://api.open-meteo.com/v1/forecast"

# Simple in-memory cache of fetched weather data
# keyed by (lat, lon, date_iso)
_CACHE: Dict[Tuple[float, float, str], dict] = {}


def get_weather(lat: float, lon: float, timestamp: str) -> dict:
    """Return historical weather information for the given location/time.

    The function queries the public Open-Meteo API. If the request fails, a
    dictionary with ``temperature`` set to ``None`` is returned.
    """
    if isinstance(timestamp, datetime.datetime):
        dt = timestamp
    else:
        dt = datetime.datetime.fromisoformat(timestamp)

    date_key = dt.date().isoformat()
    cache_key = (float(lat), float(lon), date_key)
    if cache_key in _CACHE:
        return _CACHE[cache_key]

    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "temperature_2m",
        "start_date": date_key,
        "end_date": date_key,
        "timezone": "UTC",
    }
    result = {"temperature": None}
    try:
        resp = requests.get(API_URL, params=params, timeout=5)
        resp.raise_for_status()
        data = resp.json().get("hourly", {})
        times = data.get("time", [])
        temps = data.get("temperature_2m", [])
        for t, tmp in zip(times, temps):
            if t.startswith(dt.strftime("%Y-%m-%dT%H")):
                result = {"temperature": tmp}
                break
    except Exception:
        pass

    _CACHE[cache_key] = result
    return result
