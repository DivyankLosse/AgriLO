
import paho.mqtt.client as mqtt
import json
import time
import random

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

BROKER = os.getenv("MQTT_BROKER", "localhost")
PORT = int(os.getenv("MQTT_PORT", 1883))
TOPIC = os.getenv("MQTT_TOPIC", "farm/soil/data")

client = mqtt.Client()
try:
    client.connect(BROKER, PORT, 60)
except Exception as e:
    print(f"Could not connect to broker: {e}")
    exit(1)

data = {
    "node_id": "TEST_NODE_01",
    "nitrogen": random.randint(20, 150),
    "phosphorus": random.randint(10, 80),
    "potassium": random.randint(10, 80),
    "ph": round(random.uniform(5.5, 7.5), 1),
    "moisture": round(random.uniform(30.0, 60.0), 1),
    "temperature": round(random.uniform(20.0, 30.0), 1),
    "ec": round(random.uniform(0.5, 2.5), 2)
}

payload = json.dumps(data)
client.publish(TOPIC, payload)
print(f"Published to {TOPIC}: {payload}")
client.disconnect()
