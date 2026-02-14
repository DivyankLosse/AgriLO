#include <ArduinoOTA.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <WiFiManager.h> // Install "WiFiManager" by tzapu

// MQTT Configuration
const char *mqtt_server = "10.78.51.224"; // PC/Server IP
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// Timers
unsigned long lastTelemetryTime = 0;
const long telemetryInterval = 30000; // Send health status every 30s

void setup() {
  Serial.begin(9600); // Must match Arduino Baud Rate

  // 1. WiFiManager - Handles WiFi Connection
  WiFiManager wm;
  // wm.resetSettings(); // Uncomment to wipe saved WiFi settings

  // Creates an AP named "Soil_Monitor_Setup" if it can't connect
  bool res = wm.autoConnect("Soil_Monitor_Setup", "admin123");

  if (!res) {
    Serial.println("Failed to connect");
    ESP.restart();
  }

  // 2. MQTT Setup
  client.setServer(mqtt_server, mqtt_port);

  // 3. OTA Setup (Wireless Updates)
  ArduinoOTA.setHostname("Soil-Monitor-Node01");
  ArduinoOTA.setPassword("admin"); // Security Code for updates

  ArduinoOTA.onStart([]() {
    String type =
        (ArduinoOTA.getCommand() == U_FLASH) ? "sketch" : "filesystem";
    // Serial.println("Start updating " + type);
  });
  ArduinoOTA.onEnd([]() {
    // Serial.println("\nEnd");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    // Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    // Error handling
  });

  ArduinoOTA.begin();
}

void loop() {
  ArduinoOTA.handle(); // Handle wireless updates

  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  // 4. Telemetry (Health Check)
  if (millis() - lastTelemetryTime > telemetryInterval) {
    lastTelemetryTime = millis();
    sendTelemetry();
  }

  // 5. Read Data from Arduino
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();

    // Basic validation
    if (input.length() > 0 && input.startsWith("{") && input.endsWith("}")) {
      client.publish("farm/soil/node01/data", input.c_str());
    }
  }
}

void reconnectMQTT() {
  // Try to reconnect only if WiFi is present
  if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) {
      if (client.connect("ESP8266_Soil_Node01")) {
        // Subscribe if needed
        // client.subscribe("farm/soil/node01/commands");
      } else {
        // Wait 5 seconds before retrying (non-blocking would be better but
        // keeping simple)
        delay(5000);
      }
    }
  }
}

void sendTelemetry() {
  if (client.connected()) {
    String telemetry = "{";
    telemetry += "\"rssi\":" + String(WiFi.RSSI()) + ",";
    telemetry += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
    telemetry += "\"uptime\":" + String(millis() / 1000);
    telemetry += "}";

    client.publish("farm/soil/node01/status", telemetry.c_str());
  }
}
