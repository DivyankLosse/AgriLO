import paho.mqtt.client as mqtt
import json
import csv
import os
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime

# ===========================
# LOAD CONFIGURATION
# ===========================
# Determine the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(SCRIPT_DIR, "config.json")

if not os.path.exists(CONFIG_FILE):
    time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{time_str}] CRITICAL: Config file {CONFIG_FILE} not found!")
    exit(1)

with open(CONFIG_FILE, 'r') as f:
    config = json.load(f)

BROKER = config.get("mqtt_broker", "localhost")
PORT = config.get("mqtt_port", 1883)
TOPIC = config.get("mqtt_topic", "farm/soil/data")
CSV_FILE = os.path.join(SCRIPT_DIR, config.get("csv_file", "soil_data.csv"))
LOG_FILE = os.path.join(SCRIPT_DIR, config.get("log_file", "system.log"))

# ===========================
# SETUP LOGGING
# ===========================
# Log to file (max 5MB, keep 2 backups) and Console
logging.basicConfig(
    handlers=[
        RotatingFileHandler(LOG_FILE, maxBytes=5*1024*1024, backupCount=2),
        logging.StreamHandler()
    ],
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# ===========================
# CSV SETUP
# ===========================
HEADERS = [
    "timestamp", "node_id", "moisture", "temperature",
    "ec", "nitrogen", "phosphorus", "potassium"
]

if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, "w", newline="") as f:
        csv.writer(f).writerow(HEADERS)
    logging.info(f"Created new CSV file: {CSV_FILE}")

# ===========================
# MQTT CALLBACKS
# ===========================
def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        logging.info(f"Connected to MQTT Broker: {BROKER}")
        client.subscribe(TOPIC)
    else:
        logging.error(f"Failed to connect, Return Code: {rc}")

def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    # logging.debug(f"Raw payload: {payload}")

    try:
        data = json.loads(payload)
        
        row = [
            datetime.now().isoformat(),
            data.get("node_id"),
            data.get("moisture"),
            data.get("temperature"),
            data.get("ec"),
            data.get("nitrogen"),
            data.get("phosphorus"),
            data.get("potassium")
        ]

        # Write to CSV
        with open(CSV_FILE, "a", newline="") as f:
            csv.writer(f).writerow(row)
        
        logging.info(f"Data Logged | Node: {data.get('node_id')} | Moisture: {data.get('moisture')}%")

    except json.JSONDecodeError:
        logging.warning(f"Invalid JSON received: {payload}")
    except Exception as e:
        logging.error(f"Error processing message: {e}")

# ===========================
# MAIN LOOP
# ===========================
# Use CallbackAPIVersion.VERSION2 for paho-mqtt v2 compatibility
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message

try:
    logging.info("Starting Data Logger...")
    client.connect(BROKER, PORT, 60)
    client.loop_forever()
except Exception as e:
    logging.critical(f"FATAL ERROR: {e}")
