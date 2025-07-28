const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

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
export const fetchSteps = () => apiGet('/steps');
export const fetchHeartrate = () => apiGet('/heartrate');
export const fetchSleep = () => apiGet('/sleep');
export const fetchVo2max = () => apiGet('/vo2max');
export const fetchMap = () => apiGet('/map');
export const fetchActivityTrack = (id) => apiGet(`/activities/${id}/track`);
export const fetchActivitiesByDate = () => apiGet('/activities/by-date');
export const fetchRoutes = () => apiGet('/routes');
