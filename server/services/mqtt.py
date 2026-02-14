import paho.mqtt.client as mqtt
import json
import logging
from config import settings
from sqlmodel import Session, create_engine
from models import SoilData
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database engine for background task
# Use synchronous engine for MQTT callbacks
SYNC_DATABASE_URL = settings.DATABASE_URL.replace("+aiosqlite", "")
engine = create_engine(SYNC_DATABASE_URL)

class MQTTService:
    def __init__(self):
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logger.info(f"Connected to MQTT Broker: {settings.MQTT_BROKER}")
            client.subscribe(settings.MQTT_TOPIC)
        else:
            logger.error(f"Failed to connect to MQTT Broker, Return Code: {rc}")

    def on_disconnect(self, client, userdata, rc):
        logger.warning("Disconnected from MQTT Broker")

    def on_message(self, client, userdata, msg):
        try:
            payload = msg.payload.decode()
            logger.info(f"Received MQTT Message: {payload}")
            data = json.loads(payload)

            # Validate and Save to DB
            with Session(engine) as session:
                soil_data = SoilData(
                    node_id=data.get("node_id", "unknown"),
                    nitrogen=data.get("nitrogen", 0),
                    phosphorus=data.get("phosphorus", 0),
                    potassium=data.get("potassium", 0),
                    ph=float(data.get("ph", 7.0)),
                    moisture=float(data.get("moisture", 0.0)),
                    temperature=float(data.get("temperature", 0.0)),
                    ec=float(data.get("ec", 0.0)),
                    timestamp=datetime.utcnow()
                )
                session.add(soil_data)
                session.commit()
                logger.info(f"Saved DB Record ID: {soil_data.id}")

        except json.JSONDecodeError:
            logger.error("Failed to decode JSON payload")
        except Exception as e:
            logger.error(f"Error processing MQTT message: {e}")

    def start(self):
        try:
            logger.info(f"Connecting to {settings.MQTT_BROKER}:{settings.MQTT_PORT}...")
            self.client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
            self.client.loop_start()
        except Exception as e:
            logger.error(f"Could not connect to MQTT Broker: {e}")

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()

mqtt_service = MQTTService()
