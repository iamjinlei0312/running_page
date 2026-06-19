import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__)))
from generator.db import init_db, Activity


def check_db():
    db_path = "run_page/data.db"
    session = init_db(db_path)

    activities = session.query(Activity).filter_by(type="Run").all()

    with_poly = 0
    without_poly = 0

    for a in activities:
        if a.summary_polyline:
            with_poly += 1
        else:
            without_poly += 1

    print(f"Total Runs: {len(activities)}")
    print(f"With polyline (Keep/Strava): {with_poly}")
    print(f"Without polyline (Apple Health): {without_poly}")


if __name__ == "__main__":
    check_db()
