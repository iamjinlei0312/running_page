import datetime
import os
import sys

# adding run_page to sys.path to allow generator imports
sys.path.append(os.path.join(os.path.dirname(__file__)))

from generator.db import init_db, Activity

def dedup_db():
    db_path = "run_page/data.db"
    session = init_db(db_path)
    
    activities = session.query(Activity).filter_by(type='Run').order_by(Activity.start_date_local).all()
    
    to_delete = []
    kept = []
    
    for activity in activities:
        try:
            dt = datetime.datetime.strptime(activity.start_date_local, "%Y-%m-%d %H:%M:%S")
        except Exception:
            kept.append(activity)
            continue
        
        is_duplicate = False
        duplicate_of = None
        for k in kept:
            try:
                k_dt = datetime.datetime.strptime(k.start_date_local, "%Y-%m-%d %H:%M:%S")
                diff = abs((dt - k_dt).total_seconds())
                if diff < 1800: # 30 minutes threshold for duplicates
                    is_duplicate = True
                    duplicate_of = k
                    break
            except Exception:
                pass
                
        if is_duplicate:
            # We want to keep the one that has a summary_polyline if possible,
            # or the one that already existed (usually has better data from direct sync).
            # The newly inserted Apple Health runs (without polyline) will be deleted
            # if they duplicate an existing run.
            # If the current activity HAS a polyline and the kept one DOES NOT, we swap them.
            if activity.summary_polyline and not duplicate_of.summary_polyline:
                to_delete.append(duplicate_of)
                kept.remove(duplicate_of)
                kept.append(activity)
            else:
                to_delete.append(activity)
        else:
            kept.append(activity)
            
    for act in to_delete:
        session.delete(act)
        
    session.commit()
    print(f"Deleted {len(to_delete)} duplicate runs.")

if __name__ == "__main__":
    dedup_db()
