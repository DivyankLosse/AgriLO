import paho.mqtt.client as mqtt
import os
import time

BROKER = "localhost"
PORT = 1883
TOPIC = "farm/soil/node01/data" # From Hardware/Software/config.json

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"Connected to broker at {BROKER}:{PORT}")
        client.subscribe(TOPIC)
        print(f"Subscribed to topic: {TOPIC}")
    else:
        print(f"Connection failed with code {rc}")

def on_message(client, userdata, msg):
    print(f"Received message on {msg.topic}: {msg.payload.decode()}")

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message

try:
    print("Starting listener... (waiting 30 seconds for messages)")
    client.connect(BROKER, PORT, 60)
    client.loop_start()
    time.sleep(30)
    client.loop_stop()
    client.disconnect()
except Exception as e:
    print(f"Error: {e}")
