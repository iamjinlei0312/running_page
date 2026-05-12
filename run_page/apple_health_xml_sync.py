import xml.etree.ElementTree as ET
import datetime
import os
import sys

from generator.db import init_db, update_or_create_activity, Activity

class DummyMap:
    def __init__(self):
        self.summary_polyline = ""

class DummyActivity:
    def __init__(self):
        self.id = 0
        self.name = "Run"
        self.distance = 0.0 # in meters
        self.moving_time = datetime.timedelta(seconds=0)
        self.elapsed_time = datetime.timedelta(seconds=0)
        self.type = "Run"
        self.subtype = "Run"
        self.start_date = ""
        self.start_date_local = ""
        self.location_country = ""
        self.average_heartrate = None
        self.average_speed = 0.0
        self.elevation_gain = 0.0
        self.start_latlng = None
        self.map = DummyMap()

def parse_date(date_str):
    # format: "2022-07-13 05:32:22 +0800"
    dt = datetime.datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S %z")
    local_str = dt.strftime("%Y-%m-%d %H:%M:%S")
    utc_str = dt.astimezone(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    timestamp = int(dt.timestamp())
    return dt, local_str, utc_str, timestamp

def parse_apple_health():
    xml_file = "/Users/zhangjinlei/Downloads/apple_health_export/导出.xml"
    db_path = "run_page/data.db"
    
    session = init_db(db_path)
    
    # Pre-load existing runs for quick lookup
    existing_runs = session.query(Activity).filter_by(type="Run").all()
    existing_times = []
    for r in existing_runs:
        try:
            dt = datetime.datetime.strptime(r.start_date_local, "%Y-%m-%d %H:%M:%S")
            existing_times.append(dt)
        except Exception:
            pass

    count = 0
    new_count = 0
    
    for event, elem in ET.iterparse(xml_file, events=('end',)):
        if elem.tag == 'Workout' and elem.get('workoutActivityType') == 'HKWorkoutActivityTypeRunning':
            count += 1
            
            start_date_str = elem.get('startDate')
            end_date_str = elem.get('endDate')
            
            dt_start, local_str, utc_str, timestamp = parse_date(start_date_str)
            
            dt_start_naive = datetime.datetime.strptime(local_str, "%Y-%m-%d %H:%M:%S")
            # Check if this run is already in DB (within 2 minutes)
            is_duplicate = False
            for ext in existing_times:
                diff = abs((dt_start_naive - ext).total_seconds())
                if diff <= 120:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                activity = DummyActivity()
                activity.id = timestamp
                activity.start_date_local = local_str
                activity.start_date = utc_str
                
                dt_end, _, _, _ = parse_date(end_date_str)
                
                duration_min = float(elem.get('duration', 0.0))
                if elem.get('durationUnit') == 'min':
                    duration_sec = duration_min * 60.0
                else:
                    duration_sec = duration_min * 60.0
                    
                activity.elapsed_time = datetime.timedelta(seconds=int(duration_sec))
                activity.moving_time = activity.elapsed_time
                
                distance_m = 0.0
                
                for child in elem:
                    if child.tag == 'WorkoutStatistics' and child.get('type') == 'HKQuantityTypeIdentifierDistanceWalkingRunning':
                        unit = child.get('unit')
                        val = float(child.get('sum', 0.0))
                        if unit == 'km':
                            distance_m = val * 1000.0
                        elif unit == 'mi':
                            distance_m = val * 1609.34
                        else:
                            distance_m = val * 1000.0
                
                activity.distance = distance_m
                
                if duration_sec > 0:
                    activity.average_speed = distance_m / duration_sec
                    
                # Do not filter by distance > 100 anymore to include all missing
                created = update_or_create_activity(session, activity)
                if created:
                    sys.stdout.write('+')
                    new_count += 1
                else:
                    sys.stdout.write('.')
                sys.stdout.flush()
                
            elem.clear()
            
    session.commit()
    print(f"\nProcessed {count} running workouts, inserted {new_count} new workouts.")

if __name__ == "__main__":
    parse_apple_health()
