import json
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__)))

from generator import Generator
from config import SQL_FILE, JSON_FILE


def generate_json():
    generator = Generator(SQL_FILE)
    activities_list = generator.load()
    with open(JSON_FILE, "w") as f:
        json.dump(activities_list, f)
    print("activities.json generated successfully.")


if __name__ == "__main__":
    generate_json()
