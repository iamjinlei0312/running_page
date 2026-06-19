import xml.etree.ElementTree as ET

xml_file = "/Users/zhangjinlei/Downloads/apple_health_export/导出.xml"

count = 0
for event, elem in ET.iterparse(xml_file, events=("end",)):
    if (
        elem.tag == "Workout"
        and elem.get("workoutActivityType") == "HKWorkoutActivityTypeRunning"
    ):
        print(elem.attrib)
        for child in elem:
            if child.tag == "WorkoutStatistics":
                print("WorkoutStatistics:", child.attrib)
            elif child.tag == "WorkoutRoute":
                print("WorkoutRoute:", child.attrib)
        count += 1
        if count >= 1:
            break
    elem.clear()
