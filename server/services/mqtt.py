import paho.mqtt.client as mqtt
import json
import logging
from config import settings
from pymongo import MongoClient
from datetime import datetime
import certifi

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MQTTService:
    def __init__(self):
        # ... (lines 14-18)
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        
        # Use PyMongo for synchronous DB access in callbacks
        try:
             # Extract DB name from URL or use default
            try:
                from pymongo.uri_parser import parse_uri
                parsed = parse_uri(settings.DATABASE_URL)
                db_name = parsed.get("database") or "agrilo"
            except Exception:
                db_name = "agrilo"
            
            self.mongo_client = MongoClient(settings.DATABASE_URL)
            self.db = self.mongo_client[db_name]
            logger.info(f"MQTT Service connected to MongoDB: {db_name}")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB from MQTT Service: {e}")

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

            # Save to MongoDB via PyMongo
            document = {
                "node_id": data.get("node_id", "unknown"),
                "nitrogen": int(data.get("nitrogen", 0)),
                "phosphorus": int(data.get("phosphorus", 0)),
                "potassium": int(data.get("potassium", 0)),
                "ph": float(data.get("ph", 7.0)),
                "moisture": float(data.get("moisture", 0.0)),
                "temperature": float(data.get("temperature", 0.0)),
                "ec": float(data.get("ec", 0.0)),
                "timestamp": datetime.utcnow()
            }
            
            result = self.db.soil_data.insert_one(document)
            logger.info(f"Saved DB Record ID: {result.inserted_id}")

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
        if hasattr(self, 'mongo_client'):
            self.mongo_client.close()

mqtt_service = MQTTService()
