import json
import datetime
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__)))
from generator.db import init_db, Activity


def parse_timedelta(s):
    if not s:
        return datetime.timedelta()
    # format could be "0:25:32" or "1 day, 0:25:32"
    if "day" in s:
        parts = s.split(", ")
        days = int(parts[0].split()[0])
        t = parts[1]
    else:
        days = 0
        t = s
    h, m, sec = map(float, t.split(":"))
    return datetime.timedelta(days=days, hours=h, minutes=m, seconds=sec)


def restore_db():
    db_path = "run_page/data.db"

    if os.path.exists(db_path):
        os.remove(db_path)

    session = init_db(db_path)

    json_path = "src/static/activities.json"
    with open(json_path, "r") as f:
        data = json.load(f)

    for item in data:
        act = Activity()
        act.run_id = item.get("run_id")
        act.name = item.get("name")
        act.distance = item.get("distance")
        act.moving_time = parse_timedelta(item.get("moving_time"))
        act.elapsed_time = parse_timedelta(
            item.get("elapsed_time", item.get("moving_time"))
        )
        act.type = item.get("type")
        act.subtype = item.get("subtype")
        act.start_date = item.get("start_date")
        act.start_date_local = item.get("start_date_local")
        act.location_country = item.get("location_country")
        act.summary_polyline = item.get("summary_polyline")
        act.average_heartrate = item.get("average_heartrate")
        act.average_speed = item.get("average_speed")
        act.elevation_gain = item.get("elevation_gain", 0.0)

        session.add(act)

    session.commit()
    print(f"Restored {len(data)} activities from JSON.")


if __name__ == "__main__":
    restore_db()
