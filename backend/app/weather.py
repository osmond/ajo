import datetime
from typing import Dict, Tuple, Any

import requests

API_URL = "https://api.open-meteo.com/v1/forecast"

# Simple in-memory caches of fetched weather data keyed by
# ``(lat, lon, date_iso)``. ``_CACHE`` stores successful lookups
# while ``_FAIL_CACHE`` remembers failed attempts. Each entry
# stores a tuple of ``(timestamp, data)`` so that stale values can
# be discarded.
_CACHE: Dict[Tuple[float, float, str], Tuple[float, dict]] = {}
_FAIL_CACHE: Dict[Tuple[float, float, str], Tuple[float, dict]] = {}

# Entries older than this many seconds are ignored. The value is
# intentionally small to keep the cache from growing unbounded when
# the server runs for a long time.
_CACHE_TTL = 60 * 60  # one hour
# Failure entries are kept for a much shorter time to avoid
# repeatedly querying the API when it is down.
_FAIL_TTL = 5 * 60  # five minutes


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
    now = datetime.datetime.now().timestamp()
    if cache_key in _CACHE:
        cached_ts, cached_data = _CACHE[cache_key]
        if now - cached_ts < _CACHE_TTL:
            return cached_data
        else:
            # remove stale entry
            del _CACHE[cache_key]
    if cache_key in _FAIL_CACHE:
        fail_ts, fail_data = _FAIL_CACHE[cache_key]
        if now - fail_ts < _FAIL_TTL:
            return fail_data
        else:
            del _FAIL_CACHE[cache_key]

    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": (
            "temperature_2m,precipitation,windspeed_10m,relativehumidity_2m"
        ),
        "start_date": date_key,
        "end_date": date_key,
        "timezone": "UTC",
    }
    result = {
        "temperature": None,
        "precipitation": None,
        "windspeed": None,
        "humidity": None,
    }
    try:
        resp = requests.get(API_URL, params=params, timeout=5)
        resp.raise_for_status()
        data = resp.json().get("hourly", {})
        times = data.get("time", [])
        temps = data.get("temperature_2m", [])
        precs = data.get("precipitation", [])
        winds = data.get("windspeed_10m", [])
        hums = data.get("relativehumidity_2m", [])
        for idx, t in enumerate(times):
            if t.startswith(dt.strftime("%Y-%m-%dT%H")):
                result = {
                    "temperature": temps[idx] if idx < len(temps) else None,
                    "precipitation": precs[idx] if idx < len(precs) else None,
                    "windspeed": winds[idx] if idx < len(winds) else None,
                    "humidity": hums[idx] if idx < len(hums) else None,
                }
                break
    except Exception:
        _FAIL_CACHE[cache_key] = (now, result)
        return result

    _CACHE[cache_key] = (now, result)
    if cache_key in _FAIL_CACHE:
        del _FAIL_CACHE[cache_key]
    return result
