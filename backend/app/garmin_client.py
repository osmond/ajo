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
        return [
            {
                "activityId": f"act_{i}",
                "activityType": {"typeKey": "RUN"},
                "startTimeLocal": (
                    datetime.datetime.now() - datetime.timedelta(days=i)
                ).isoformat(),
            }
            for i in range(1, 6)
        ]

    @property
    def dummy_activities(self):
        if not hasattr(self, "_dummy_activities"):
            self._dummy_activities = self.__init_dummy_activities()
        return self._dummy_activities

    def get_activities(self, start: int = 0, limit: int = 50):
        return self.dummy_activities[start : start + limit]

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
