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
