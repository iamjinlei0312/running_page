import datetime
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__)))

from generator.db import init_db, Activity

def find_duplicates():
    db_path = "data.db"
    session = init_db(db_path)
    
    activities = session.query(Activity).filter_by(type='Run').order_by(Activity.start_date_local).all()
    
    print(f"Total runs: {len(activities)}")
    
    duplicates = []
    
    for i in range(len(activities)):
        try:
            dt_i = datetime.datetime.strptime(activities[i].start_date_local, "%Y-%m-%d %H:%M:%S")
        except Exception:
            continue
            
        for j in range(i+1, len(activities)):
            try:
                dt_j = datetime.datetime.strptime(activities[j].start_date_local, "%Y-%m-%d %H:%M:%S")
                diff = abs((dt_i - dt_j).total_seconds())
                
                # if more than 2 hours apart, we can stop searching forward
                if diff > 7200:
                    break
                    
                if diff < 1800:
                    print(f"Duplicate found! {activities[i].start_date_local} (ID {activities[i].run_id}) and {activities[j].start_date_local} (ID {activities[j].run_id})")
                    duplicates.append((activities[i], activities[j]))
            except Exception:
                pass
                
    print(f"Found {len(duplicates)} duplicates.")

if __name__ == "__main__":
    find_duplicates()
