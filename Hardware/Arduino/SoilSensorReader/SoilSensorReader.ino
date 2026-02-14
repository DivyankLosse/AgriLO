#include <ArduinoJson.h>
#include <ModbusMaster.h>
#include <SoftwareSerial.h>
#include <avr/wdt.h> // Include Watchdog Timer

// PIN CONFIGURATION
#define RE_DE_PIN 7
#define RO_PIN 8
#define DI_PIN 9

SoftwareSerial modbusSerial(RO_PIN, DI_PIN); // RX, TX
ModbusMaster node;

unsigned long lastReadTime = 0;
const long interval = 5000; // Read every 5 seconds

void preTransmission() { digitalWrite(RE_DE_PIN, HIGH); }
void postTransmission() { digitalWrite(RE_DE_PIN, LOW); }

void setup() {
  wdt_disable(); // Always good practice to disable first

  pinMode(RE_DE_PIN, OUTPUT);
  digitalWrite(RE_DE_PIN, LOW);

  // Serial to ESP8266
  Serial.begin(9600);

  // Modbus to Sensor
  modbusSerial.begin(9600);

  // Initialize Modbus ID 1
  node.begin(1, modbusSerial);
  node.preTransmission(preTransmission);
  node.postTransmission(postTransmission);

  delay(1000);

  // Enable Watchdog Timer (8 Seconds)
  // If loop hangs for >8s, system will reset
  wdt_enable(WDTO_8S);
}

void loop() {
  wdt_reset(); // "Kick" the dog to prevent reset

  // Non-blocking timer
  if (millis() - lastReadTime >= interval) {
    lastReadTime = millis();
    readAndSendSensorData();
  }
}

void readAndSendSensorData() {
  float sumMoisture = 0, sumTemp = 0;
  long sumEC = 0, sumN = 0, sumP = 0, sumK = 0;
  int validReadings = 0;
  int samples = 3; // Take 3 averages

  for (int i = 0; i < samples; i++) {
    wdt_reset(); // Keep resetting WDT during sampling
    uint8_t result = node.readHoldingRegisters(0x0004, 6);

    if (result == node.ku8MBSuccess) {
      sumMoisture += node.getResponseBuffer(0) / 100.0;
      sumTemp += node.getResponseBuffer(1) / 100.0;
      sumEC += node.getResponseBuffer(2);
      sumN += node.getResponseBuffer(3);
      sumP += node.getResponseBuffer(4);
      sumK += node.getResponseBuffer(5);
      validReadings++;
    }
    delay(100); // Short delay between samples
  }

  if (validReadings > 0) {
    StaticJsonDocument<256> doc;
    doc["node_id"] = "node01";
    // Calculate Averages
    doc["moisture"] = sumMoisture / validReadings;
    doc["temperature"] = sumTemp / validReadings;
    doc["ec"] = sumEC / validReadings;
    doc["nitrogen"] = sumN / validReadings;
    doc["phosphorus"] = sumP / validReadings;
    doc["potassium"] = sumK / validReadings;

    // Serialize to Serial (send to ESP8266)
    serializeJson(doc, Serial);
    Serial.println();
  }
}
