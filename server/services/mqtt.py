import paho.mqtt.client as mqtt
import json
import logging
from config import settings
from sqlmodel import create_engine, Session, SQLModel
from datetime import datetime
from models import SoilData

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Sync Engine for MQTT Callbacks
SYNC_DATABASE_URL = settings.DATABASE_URL.replace("+aiosqlite", "")
engine = create_engine(SYNC_DATABASE_URL, echo=False) # Echo False to avoid log spam

class MQTTService:
    def __init__(self):
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        
        try:
             # Ensure tables exist (optional here if main app runs it, but safer)
            # SQLModel.metadata.create_all(engine)
            logger.info("MQTT Service initialized with SQLite")
        except Exception as e:
            logger.error(f"Failed to initialize SQLite for MQTT: {e}")

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

            # Prepare record with Dynamic Scaling
            nitrogen = int(int(data.get("nitrogen", 0)) * settings.SOIL_RAW_SCALE)
            phosphorus = int(int(data.get("phosphorus", 0)) * settings.SOIL_RAW_SCALE)
            potassium = int(int(data.get("potassium", 0)) * settings.SOIL_RAW_SCALE)
            ph = float(data.get("ph", 7.0))
            moisture = float(data.get("moisture", 0.0))
            
            # Outlier Detection & Data Integrity
            if not (0 <= ph <= 14):
                logger.warning(f"Invalid pH value: {ph}. Skipping record.")
                return
            if not (0 <= moisture <= 100):
                 logger.warning(f"Invalid moisture value: {moisture}. Skipping record.")
                 return
            if nitrogen > 1000 or phosphorus > 1000 or potassium > 1000:
                logger.warning(f"Extreme NPK spike detected (N:{nitrogen}, P:{phosphorus}, K:{potassium}). Potential sensor error.")
                return

            soil_record = SoilData(
                node_id=data.get("node_id", "unknown"),
                nitrogen=nitrogen,
                phosphorus=phosphorus,
                potassium=potassium,
                ph=ph,
                moisture=moisture,
                temperature=float(data.get("temperature", 0.0)),
                ec=float(data.get("ec", 0.0)),
                timestamp=datetime.utcnow()
            )
            
            # Validate Data: Ignore if all NPK are 0 (indicates sensor error or polling skip)
            if soil_record.nitrogen == 0 and soil_record.phosphorus == 0 and soil_record.potassium == 0:
                logger.warning("Received zeroed NPK data, skipping DB save to prevent stale readings.")
                return

            with Session(engine) as session:
                session.add(soil_record)
                session.commit()
                session.refresh(soil_record)
                logger.info(f"Saved DB Record ID: {soil_record.id}")

        except json.JSONDecodeError:
            logger.error("Failed to decode JSON payload")
        except Exception as e:
            logger.error(f"Error processing MQTT message: {e}")

    def start(self):
        try:
            logger.info(f"Connecting to {settings.MQTT_BROKER}:{settings.MQTT_PORT}...")
            # client.connect might block or fail, handle specifically
            self.client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
            self.client.loop_start()
        except Exception as e:
            logger.error(f"Could not connect to MQTT Broker: {e}")

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()

mqtt_service = MQTTService()
