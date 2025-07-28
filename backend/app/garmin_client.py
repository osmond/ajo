import os
import datetime
import random


class GarminClient:
    """Placeholder Garmin API client."""

    def __init__(self):
        self.consumer_key = os.getenv("GC_CONSUMER_KEY")
        self.consumer_secret = os.getenv("GC_CONSUMER_SECRET")
        self.oauth_token = os.getenv("GC_OAUTH_TOKEN")
        self.oauth_token_secret = os.getenv("GC_OAUTH_TOKEN_SECRET")

    @property
    def has_credentials(self) -> bool:
        """Return True if all required credentials are present."""
        return all(
            [
                self.consumer_key,
                self.consumer_secret,
                self.oauth_token,
                self.oauth_token_secret,
            ]
        )

    def _metric_points(
        self,
        count: int,
        start: datetime.datetime,
        delta: datetime.timedelta,
        low: int,
        high: int,
    ):
        points = []
        for i in range(count):
            ts = (start + delta * i).isoformat()
            points.append({"timestamp": ts, "value": random.randint(low, high)})
        return points

    def __init_dummy_activities(self):
        activities = []
        # Center the dummy data around Madison, WI
        base_lat, base_lon = 43.0731, -89.4012
        for i in range(1, 6):
            lat = base_lat + random.uniform(-0.02, 0.02)
            lon = base_lon + random.uniform(-0.02, 0.02)
            act_type = "RUN" if i % 2 else "BIKE"
            activities.append(
                {
                    "activityId": f"act_{i}",
                    "activityType": {"typeKey": act_type},
                    "startTimeLocal": (
                        datetime.datetime.now() - datetime.timedelta(days=i)
                    ).isoformat(),
                    "startLat": lat,
                    "startLon": lon,
                }
            )
        return activities

    @property
    def dummy_activities(self):
        if not hasattr(self, "_dummy_activities"):
            self._dummy_activities = self.__init_dummy_activities()
        return self._dummy_activities

    def get_activities(self, start: int = 0, limit: int = 50, activity_type: str | None = None):
        acts = self.dummy_activities
        if activity_type:
            activity_type = activity_type.lower()
            acts = [a for a in acts if a["activityType"]["typeKey"].lower() == activity_type]
        return acts[start : start + limit]

    def get_activities_by_date(self):
        """Return activities grouped by date with start coords."""
        groups = {}
        for act in self.dummy_activities:
            date = act["startTimeLocal"].split("T")[0]
            entry = {
                "activityId": act["activityId"],
                "lat": act["startLat"],
                "lon": act["startLon"],
            }
            groups.setdefault(date, []).append(entry)
        return groups

    def get_activity(self, activity_id: str):
        for act in self.dummy_activities:
            if act["activityId"] == activity_id:
                return {
                    **act,
                    "distance": 5000 + len(activity_id) * 10,
                    "duration": 1800,
                    "calories": 300,
                    "type": "Run",
                    "startTimeLocal": act["startTimeLocal"],
                }
        raise KeyError("Activity not found")

    def get_steps(self):
        now = (
            datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            - datetime.timedelta(days=6)
        )
        return self._metric_points(7, now, datetime.timedelta(days=1), 3000, 12000)

    def get_heartrate(self):
        now = datetime.datetime.now() - datetime.timedelta(hours=23)
        return self._metric_points(24, now, datetime.timedelta(hours=1), 60, 160)

    def get_vo2max(self):
        start = datetime.datetime.now() - datetime.timedelta(weeks=9)
        return self._metric_points(10, start, datetime.timedelta(weeks=1), 40, 55)

    def get_sleep(self):
        now = (
            datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            - datetime.timedelta(days=6)
        )
        points = self._metric_points(7, now, datetime.timedelta(days=1), 5, 9)
        for p in points:
            p["value"] = float(p["value"])
        return points

    def get_map(self):
        start = datetime.datetime.now() - datetime.timedelta(minutes=19)
        return self._metric_points(20, start, datetime.timedelta(minutes=1), 0, 100)

    def get_track(self, activity_id: str):
        """Return dummy GPS points for an activity."""
        for act in self.dummy_activities:
            if act["activityId"] == activity_id:
                start = datetime.datetime.fromisoformat(act["startTimeLocal"])
                points = []
                # Default coordinates also fall back to Madison if missing
                lat = act.get("startLat", 43.0731)
                lon = act.get("startLon", -89.4012)
                for i in range(20):
                    ts = (start + datetime.timedelta(minutes=i)).isoformat()
                    points.append(
                        {
                            "timestamp": ts,
                            "lat": lat + i * 0.001,
                            "lon": lon + i * 0.001,
                            "heartRate": random.randint(60, 170),
                            "speed": round(random.uniform(2.5, 6.0), 2),
                        }
                    )
                return points
        raise KeyError("Activity not found")
