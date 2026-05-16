import json
import os
import subprocess
from collections import defaultdict

def main():
    # Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    activities_file = os.path.join(base_dir, "src", "static", "activities.json")
    json_out_file = os.path.join(base_dir, "github_poster_data.json")
    final_svg_dir = os.path.join(base_dir, "OUT_FOLDER")
    svg_file = os.path.join(final_svg_dir, "json_circular.svg")
    
    if not os.path.exists(activities_file):
        print("activities.json not found")
        return

    # Parse activities
    with open(activities_file, "r") as f:
        activities = json.load(f)

    # Group by date
    daily_distance = defaultdict(float)
    for activity in activities:
        if 'start_date_local' in activity and 'distance' in activity:
            date_str = activity['start_date_local'].split(' ')[0]
            distance_km = activity['distance'] / 1000.0
            daily_distance[date_str] += distance_km

    # Write temporary JSON
    out_data = {date: round(dist, 2) for date, dist in sorted(daily_distance.items())}
    with open(json_out_file, "w") as f:
        json.dump(out_data, f, indent=2)

    # Run github_poster
    print("Running github_poster...")
    cmd = [
        "github_poster", "json",
        "--json_file", json_out_file,
        "--me", os.environ.get("ATHLETE", "Jinlei"),
        "--is-circular",
        "--year", "2016-2026"
    ]
    subprocess.run(cmd, cwd=base_dir, check=True)

    # Replace "times" with "km" in SVG
    if os.path.exists(svg_file):
        with open(svg_file, "r") as f:
            content = f.read()
        content = content.replace(" times", " km")
        with open(svg_file, "w") as f:
            f.write(content)
        print(f"Replaced 'times' with 'km' in {svg_file}")
    else:
        print(f"Error: {svg_file} not generated.")

if __name__ == "__main__":
    main()
