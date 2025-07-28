const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export const fetchSteps = () => apiGet('/api/steps');
export const fetchHeartrate = () => apiGet('/api/heartrate');
export const fetchSleep = () => apiGet('/api/sleep');
export const fetchVo2max = () => apiGet('/api/vo2max');
export const fetchMap = () => apiGet('/api/map');
