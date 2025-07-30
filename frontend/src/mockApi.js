const BASE_LAT = 43.0731;
const BASE_LON = -89.4012;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

export function generateDummyActivities(days = 100) {
  const activities = [];
  for (let i = 1; i <= days; i++) {
    const actType = i % 2 ? 'RUN' : 'BIKE';
    const distKm = rand(3, 12);
    const duration = Math.round(distKm * rand(5.5, 7.0) * 60);
    const start = new Date();
    start.setDate(start.getDate() - i);
    start.setHours(randInt(0, 23), randInt(0, 59), randInt(0, 59), 0);
    activities.push({
      activityId: `act_${i}`,
      activityType: { typeKey: actType },
      startTimeLocal: start.toISOString(),
      startLat: BASE_LAT + rand(-0.02, 0.02),
      startLon: BASE_LON + rand(-0.02, 0.02),
      distance: Math.round(distKm * 1000),
      duration,
    });
  }
  return activities;
}

const dummyActivities = generateDummyActivities(365);

function metricPoints(count, start, deltaMs, low, high, floatVals = false) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const ts = new Date(start.getTime() + deltaMs * i).toISOString();
    let val = randInt(low, high);
    if (floatVals) val = parseFloat(val);
    pts.push({ timestamp: ts, value: val });
  }
  return pts;
}

export function activities({ start = 0, limit = 50, type } = {}) {
  let acts = dummyActivities;
  if (type) {
    const lt = type.toLowerCase();
    acts = acts.filter(
      (a) => a.activityType.typeKey.toLowerCase() === lt
    );
  }
  return Promise.resolve(acts.slice(start, start + limit));
}

export function activitiesByDate() {
  const groups = {};
  for (const act of dummyActivities) {
    const date = act.startTimeLocal.split('T')[0];
    const entry = {
      activityId: act.activityId,
      lat: act.startLat,
      lon: act.startLon,
    };
    (groups[date] ||= []).push(entry);
  }
  return Promise.resolve(groups);
}

export function activity(id) {
  const act = dummyActivities.find((a) => a.activityId === id);
  if (!act) return Promise.reject(new Error('Activity not found'));
  return Promise.resolve({
    ...act,
    distance: act.distance ?? 0,
    duration: act.duration ?? 0,
    calories: 300,
    type: 'Run',
    startTimeLocal: act.startTimeLocal,
  });
}

export function steps() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - 99);
  return Promise.resolve(
    metricPoints(100, now, 86400000, 3000, 12000)
  );
}

export function heartrate() {
  const start = new Date(Date.now() - 23 * 3600000);
  return Promise.resolve(metricPoints(24, start, 3600000, 60, 160));
}

export function vo2max() {
  const start = new Date(Date.now() - 9 * 7 * 86400000);
  return Promise.resolve(metricPoints(10, start, 7 * 86400000, 40, 55));
}

export function sleep() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - 99);
  return Promise.resolve(
    metricPoints(100, now, 86400000, 5, 9, true)
  );
}

export function map() {
  const start = new Date(Date.now() - 19 * 60000);
  return Promise.resolve(metricPoints(20, start, 60000, 0, 100));
}

export function activityTrack(id) {
  const act = dummyActivities.find((a) => a.activityId === id);
  if (!act) return Promise.reject(new Error('Activity not found'));
  const start = new Date(act.startTimeLocal);
  const lat = act.startLat ?? BASE_LAT;
  const lon = act.startLon ?? BASE_LON;
  const pts = [];
  for (let i = 0; i < 20; i++) {
    const ts = new Date(start.getTime() + i * 60000).toISOString();
    pts.push({
      timestamp: ts,
      lat: lat + i * 0.001,
      lon: lon + i * 0.001,
      elevation: 260 + rand(-5, 5),
      heartRate: randInt(60, 170),
      speed: parseFloat(rand(2.5, 6.0).toFixed(2)),
    });
  }
  return Promise.resolve(pts);
}

export function runs() {
  const activities = dummyActivities.filter(
    (a) => a.activityType.typeKey === 'RUN'
  );
  const results = [];
  for (const act of activities) {
    const date = act.startTimeLocal.split('T')[0];
    const start = new Date(act.startTimeLocal);
    const lat = act.startLat ?? BASE_LAT;
    const lon = act.startLon ?? BASE_LON;
    const track = [];
    for (let i = 0; i < 20; i++) {
      const ts = new Date(start.getTime() + i * 60000).toISOString();
      track.push({
        timestamp: ts,
        lat: lat + i * 0.001,
        lon: lon + i * 0.001,
        elevation: 260 + rand(-5, 5),
      });
    }
    let elevGain = 0;
    let prev = null;
    for (const pt of track) {
      const elev = pt.elevation;
      if (prev !== null && elev > prev) elevGain += elev - prev;
      prev = elev;
    }
    results.push({
      date,
      distance: act.distance ?? 0,
      duration: act.duration ?? 0,
      elevationGain: parseFloat(elevGain.toFixed(2)),
    });
  }
  return Promise.resolve(results.sort((a, b) => a.date.localeCompare(b.date)));
}

export function dailyTotals() {
  const totals = {};
  for (const act of dummyActivities) {
    const date = act.startTimeLocal.split('T')[0];
    const entry = (totals[date] ||= { distance: 0, duration: 0 });
    entry.distance += act.distance ?? 0;
    entry.duration += act.duration ?? 0;
  }
  return Promise.resolve(
    Object.entries(totals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({ date, ...vals }))
  );
}

function randomNormal(mean, stdDev) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

export function analysis({ start, end } = {}) {
  let acts = [...dummyActivities];
  if (start || end) {
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    acts = acts.filter((a) => {
      const d = new Date(a.startTimeLocal);
      if (s && d < s) return false;
      if (e && d > e) return false;
      return true;
    });
  }
  const results = [];
  for (const act of acts) {
    const distance = act.distance ?? 0;
    const startDt = new Date(act.startTimeLocal);
    const lat = act.startLat ?? BASE_LAT;
    const lon = act.startLon ?? BASE_LON;
    const track = [];
    for (let i = 0; i < 20; i++) {
      const ts = new Date(startDt.getTime() + i * 60000).toISOString();
      track.push({
        timestamp: ts,
        lat: lat + i * 0.001,
        lon: lon + i * 0.001,
        heartRate: randInt(60, 170),
        speed: parseFloat(rand(2.5, 6.0).toFixed(2)),
      });
    }
    const temp = parseFloat(rand(-5, 35).toFixed(1));
    const avgHr = track.reduce((s, p) => s + p.heartRate, 0) / track.length;
    const basePace = 5.5 + 0.02 * Math.max(temp - 15, 0);
    const avgPace = parseFloat(randomNormal(basePace, 0.3).toFixed(2));
    results.push({
      activityId: act.activityId,
      temperature: temp,
      avgPace,
      avgHeartRate: parseFloat(avgHr.toFixed(1)),
      distance,
    });
  }
  return Promise.resolve(results);
}
