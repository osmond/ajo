from fastapi.testclient import TestClient
import os
import sys
import requests
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from app.main import app

client = TestClient(app)


def test_activities_list():
    resp = client.get('/activities')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data
    assert 'activityId' in data[0]


def test_activities_filter_type():
    resp = client.get('/activities?type=run')
    assert resp.status_code == 200
    data = resp.json()
    assert data
    assert all(a['activityType']['typeKey'].lower() == 'run' for a in data)


def test_activities_by_date():
    resp = client.get('/activities/by-date')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, dict)
    assert data
    # pick first date
    first_date = list(data.keys())[0]
    first_entry = data[first_date][0]
    assert 'activityId' in first_entry and 'lat' in first_entry and 'lon' in first_entry


def test_activity_detail():
    list_resp = client.get('/activities')
    aid = list_resp.json()[0]['activityId']
    resp = client.get(f'/activities/{aid}')
    assert resp.status_code == 200
    detail = resp.json()
    assert detail['activityId'] == aid
    assert 'distance' in detail


def _check_metric_list(path):
    resp = client.get(path)
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data and 'timestamp' in data[0] and 'value' in data[0]


def test_steps_endpoint():
    _check_metric_list('/steps')


def test_heartrate_endpoint():
    _check_metric_list('/heartrate')


def test_vo2max_endpoint():
    _check_metric_list('/vo2max')


def test_sleep_endpoint():
    resp = client.get('/sleep')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data and isinstance(data[0]['value'], float)


def test_map_endpoint():
    _check_metric_list('/map')


def test_activity_track(monkeypatch):
    from app import weather

    def fake_weather(lat, lon, ts):
        return {
            "temperature": 22,
            "precipitation": 0.0,
            "windspeed": 3.2,
            "humidity": 55,
        }

    monkeypatch.setattr(weather, "get_weather", fake_weather)

    list_resp = client.get('/activities')
    aid = list_resp.json()[0]['activityId']
    resp = client.get(f'/activities/{aid}/track')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data and 'timestamp' in data[0] and 'lat' in data[0] and 'lon' in data[0]
    assert 'heartRate' in data[0] and 'speed' in data[0]
    assert 'elevation' in data[0]
    assert 'temperature' in data[0] and 'precipitation' in data[0]
    assert 'windspeed' in data[0] and 'humidity' in data[0]


def test_daily_totals_endpoint():
    resp = client.get('/daily-totals')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data and 'date' in data[0] and 'distance' in data[0] and 'duration' in data[0]


def test_runs_endpoint():
    resp = client.get('/runs')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data
    first = data[0]
    assert 'date' in first and 'distance' in first and 'duration' in first and 'elevationGain' in first


def test_analysis_endpoint():
    from app.main import dummy_activities

    date = dummy_activities[0]['startTimeLocal'].split('T')[0]
    resp = client.get(f'/analysis?start={date}&end={date}')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data
    assert len(data) == 1
    first = data[0]
    assert 'avgPace' in first and 'temperature' in first
    assert 'distance' in first and 'avgHeartRate' in first


def test_weather_cached(monkeypatch):
    """Repeated weather calls should hit the API only once."""
    from app import weather

    # Clear any existing cache
    weather._CACHE.clear()
    weather._FAIL_CACHE.clear()

    calls = []

    def fake_get(url, params=None, timeout=5):
        calls.append(1)

        class Resp:
            def raise_for_status(self):
                pass

            def json(self):
                return {
                    "hourly": {
                        "time": [params["start_date"] + "T12:00"],
                        "temperature_2m": [20],
                        "precipitation": [0.1],
                        "windspeed_10m": [5.5],
                        "relativehumidity_2m": [60],
                    }
                }

        return Resp()

    monkeypatch.setattr(weather.requests, "get", fake_get)

    lat, lon, ts = 10.0, 20.0, "2022-01-01T12:34:56"
    result1 = weather.get_weather(lat, lon, ts)
    result2 = weather.get_weather(lat, lon, ts)

    expected = {
        "temperature": 20,
        "precipitation": 0.1,
        "windspeed": 5.5,
        "humidity": 60,
    }

    assert result1 == expected
    assert result2 == expected
    assert len(calls) == 1


def test_weather_cache_expiry(monkeypatch):
    """Expired cache entries should be discarded."""
    from app import weather

    weather._CACHE.clear()
    weather._FAIL_CACHE.clear()
    # expire immediately
    monkeypatch.setattr(weather, "_CACHE_TTL", 0)

    calls = []

    def fake_get(url, params=None, timeout=5):
        calls.append(1)

        class Resp:
            def raise_for_status(self):
                pass

            def json(self):
                return {
                    "hourly": {
                        "time": [params["start_date"] + "T12:00"],
                        "temperature_2m": [15],
                        "precipitation": [0.0],
                        "windspeed_10m": [3.0],
                        "relativehumidity_2m": [50],
                    }
                }

        return Resp()

    monkeypatch.setattr(weather.requests, "get", fake_get)

    lat, lon, ts = 1.0, 2.0, "2022-01-02T12:00:00"
    weather.get_weather(lat, lon, ts)
    weather.get_weather(lat, lon, ts)

    assert len(calls) == 2
    assert len(weather._CACHE) == 1


def test_weather_failure_cache(monkeypatch):
    """Failed requests should not populate the main cache."""
    from app import weather

    weather._CACHE.clear()
    weather._FAIL_CACHE.clear()

    calls = []

    def fake_get(url, params=None, timeout=5):
        calls.append(1)

        class Resp:
            def raise_for_status(self):
                raise requests.RequestException("boom")

        return Resp()

    monkeypatch.setattr(weather.requests, "get", fake_get)

    lat, lon, ts = 3.0, 4.0, "2022-01-03T10:00:00"
    weather.get_weather(lat, lon, ts)
    assert len(weather._CACHE) == 0
    assert len(weather._FAIL_CACHE) == 1

    # second call should use failure cache and not call the API again
    weather.get_weather(lat, lon, ts)
    assert len(calls) == 1

    # expire failure cache and ensure API is retried
    monkeypatch.setattr(weather, "_FAIL_TTL", 0)
    weather.get_weather(lat, lon, ts)
    assert len(calls) == 2
