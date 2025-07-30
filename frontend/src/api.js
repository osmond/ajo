import * as mockApi from './mockApi';

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || '').trim();
const USE_MOCK = !BASE_URL || BASE_URL === 'mock';

async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

// Backend routes do not use an "/api" prefix, so requests should be made
// directly to the root paths. Using a prefix caused 404 errors when running the
// app locally.
export const fetchSteps = () =>
  USE_MOCK ? mockApi.steps() : apiGet('/steps');
export const fetchHeartrate = () =>
  USE_MOCK ? mockApi.heartrate() : apiGet('/heartrate');
export const fetchSleep = () =>
  USE_MOCK ? mockApi.sleep() : apiGet('/sleep');
export const fetchVo2max = () =>
  USE_MOCK ? mockApi.vo2max() : apiGet('/vo2max');
export const fetchMap = () => (USE_MOCK ? mockApi.map() : apiGet('/map'));
export const fetchActivityTrack = (id) =>
  USE_MOCK ? mockApi.activityTrack(id) : apiGet(`/activities/${id}/track`);
export const fetchActivitiesByDate = () =>
  USE_MOCK ? mockApi.activitiesByDate() : apiGet('/activities/by-date');
export const fetchDailyTotals = () =>
  USE_MOCK ? mockApi.dailyTotals() : apiGet('/daily-totals');
export const fetchRuns = () =>
  USE_MOCK ? mockApi.runs() : apiGet('/runs');
export const fetchAnalysis = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return USE_MOCK
    ? mockApi.analysis(params)
    : apiGet(`/analysis${qs ? `?${qs}` : ''}`);
};
export const fetchActivities = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return USE_MOCK
    ? mockApi.activities(params)
    : apiGet(`/activities${qs ? `?${qs}` : ''}`);
};
