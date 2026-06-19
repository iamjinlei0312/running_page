import xml.etree.ElementTree as ET


def count_apple_health():
    xml_file = "/Users/zhangjinlei/Downloads/apple_health_export/导出.xml"
    count = 0
    for event, elem in ET.iterparse(xml_file, events=("end",)):
        if (
            elem.tag == "Workout"
            and elem.get("workoutActivityType") == "HKWorkoutActivityTypeRunning"
        ):
            count += 1
        elem.clear()
    print(f"Total running workouts in Apple Health: {count}")


if __name__ == "__main__":
    count_apple_health()
