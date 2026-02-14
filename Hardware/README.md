# Agri-Lo IoT Hardware

This directory contains the firmware for the Soil Monitoring System.

## Contents

-   **Arduino/**: Firmware for the Arduino UNO using Modbus to read soil sensors.
-   **ESP8266/**: Firmware for the ESP8266 Wi-Fi Gateway to transmit data to the Agri-Lo Backend.

## Setup Instructions

### 1. Arduino
1.  Open `Arduino/SoilSensorReader/SoilSensorReader.ino`.
2.  Install libraries: `ModbusMaster`, `ArduinoJson`.
3.  Upload to Arduino UNO.

### 2. ESP8266
1.  Open `ESP8266/WiFiGateway/WiFiGateway.ino`.
2.  Install libraries: `PubSubClient`, `WiFiManager`, `ArduinoOTA`.
3.  Upload to ESP8266.
