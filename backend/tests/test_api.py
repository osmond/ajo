from fastapi.testclient import TestClient
import os
import sys
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


def test_activity_track():
    list_resp = client.get('/activities')
    aid = list_resp.json()[0]['activityId']
    resp = client.get(f'/activities/{aid}/track')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data and 'timestamp' in data[0] and 'lat' in data[0] and 'lon' in data[0]
    assert 'heartRate' in data[0] and 'speed' in data[0]
    assert 'temperature' in data[0] and 'precipitation' in data[0]
    assert 'windspeed' in data[0] and 'humidity' in data[0]


def test_routes_endpoint():
    resp = client.get('/routes')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data and 'lat' in data[0] and 'lon' in data[0]


def test_daily_totals_endpoint():
    resp = client.get('/daily-totals')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data and 'date' in data[0] and 'distance' in data[0] and 'duration' in data[0]


def test_analysis_endpoint():
    resp = client.get('/analysis')
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert data and 'avgPace' in data[0] and 'temperature' in data[0]


def test_weather_cached(monkeypatch):
    """Repeated weather calls should hit the API only once."""
    from app import weather

    # Clear any existing cache
    weather._CACHE.clear()

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
                    }
                }

        return Resp()

    monkeypatch.setattr(weather.requests, "get", fake_get)

    lat, lon, ts = 10.0, 20.0, "2022-01-01T12:34:56"
    result1 = weather.get_weather(lat, lon, ts)
    result2 = weather.get_weather(lat, lon, ts)

    assert result1 == {"temperature": 20}
    assert result2 == {"temperature": 20}
    assert len(calls) == 1
