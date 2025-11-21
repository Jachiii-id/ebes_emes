#include <WiFi.h>
#include <PubSubClient.h>
#include <math.h>
#include <Preferences.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <ArduinoJson.h>

// =====================
// --- KONFIGURASI ---
// =====================
const int MQ7_PIN = 34;        // Pin analog MQ-7
const float RL_VALUE = 10.0;   // Resistor beban (kΩ)
const float VOLTAGE_IN = 5;  // Tegangan ESP32
float RO_VALUE = 20.0;         // Nilai Ro default (WAJIB dikalibrasi!)

// --- Kredensial WiFi ---
const char* ssid = "alwi";
const char* password = "hahahaha";

// --- Info Broker MQTT ---
const char* mqtt_server = "test.mosquitto.org";
const int mqtt_port = 1883;

// --- Topik MQTT ---
const char* topic_data = "device/air-data";
const char* topic_gps_data = "device/gps-data";
const char* topic_calibrate = "sensors/calibrate";
const char* topic_status = "sensors/co/status";

const int GPS_RX_PIN = 19;  // connect GPS TX → GPIO16
const int GPS_TX_PIN = 18;  // connect GPS RX → GPIO17

// --- Klien WiFi dan MQTT ---
WiFiClient espClient;
PubSubClient client(espClient);
Preferences prefs;
TinyGPSPlus gps;
HardwareSerial SerialGPS(2);  // UART2 for GPS
String espId;                 // store the UUID of this device

String generateUUID() {
  char uuid[37];
  sprintf(uuid, "%04x%04x-%04x-%04x-%04x-%04x%04x%04x",
          (uint16_t)random(0, 0xffff), (uint16_t)random(0, 0xffff),
          (uint16_t)random(0, 0xffff),
          (uint16_t)random(0, 0x0fff) | 0x4000,
          (uint16_t)random(0, 0x3fff) | 0x8000,
          (uint16_t)random(0, 0xffff), (uint16_t)random(0, 0xffff),
          (uint16_t)random(0, 0xffff));
  return String(uuid);
}

// =====================
// --- Save / Load Ro ---
// =====================
void saveRoToFlash(float ro) {
  prefs.begin("mq7", false);
  prefs.putFloat("ro_value", ro);
  prefs.end();
  Serial.print("💾 Ro saved to flash: ");
  Serial.println(ro, 2);
}

void loadRoFromFlash() {
  prefs.begin("mq7", false);

  if (prefs.isKey("ro_value")) {
    RO_VALUE = prefs.getFloat("ro_value", 20.0);
    Serial.print("📂 Loaded Ro from flash: ");
    Serial.println(RO_VALUE, 2);
  } else {
    Serial.println("⚠️ No stored Ro found, using default (20.0).");
  }

  if (prefs.isKey("uuid")) {
    espId = prefs.getString("uuid", "");
    Serial.print("🆔 Loaded device UUID: ");
    Serial.println(espId);
  } else {
    espId = generateUUID();
    prefs.putString("uuid", espId);

    Serial.print("✨ Generated and saved new UUID: ");
    Serial.println(espId);
  }

  prefs.end();
}

// --- Variabel Kalibrasi Non-Blocking ---
bool isCalibrating = false;
int calibrationSampleCount = 0;
float calibrationTotalRs = 0.0;
unsigned long lastCalibrationSampleTime = 0;
const int TOTAL_CALIBRATION_SAMPLES = 50;  // Ambil 50 sampel
const int CALIBRATION_INTERVAL = 200;      // Jeda 100ms antar sampel

// ==========================
// --- Fungsi Bantuan ---
// ==========================
String getStatus(float ppm) {
  if (ppm <= 4.0) return "BAIK";
  else if (ppm <= 8.0) return "SEDANG";
  else if (ppm <= 15.0) return "TIDAK SEHAT";
  else if (ppm <= 30.0) return "SGT TDK SEHAT";
  else return "BERBAHAYA";
}

// ==========================
// --- Setup WiFi ---
// ==========================
void setupWiFi() {
  Serial.println();
  Serial.print("Menghubungkan ke WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("✅ WiFi terhubung! IP: ");
  Serial.println(WiFi.localIP());
}

// ==========================
// --- Kalibrasi Non-Blocking ---
// ==========================

// Dipanggil dari dalam loop() utama
void handleCalibration() {
  // Hanya berjalan jika isCalibrating = true
  if (!isCalibrating) {
    return;
  }

  // Cek apakah sudah waktunya mengambil sampel berikutnya
  if (millis() - lastCalibrationSampleTime >= CALIBRATION_INTERVAL) {
    lastCalibrationSampleTime = millis();

    // 1. Ambil 1 sampel
    int adcValue = analogRead(MQ7_PIN);
    float voltage = adcValue * (VOLTAGE_IN / 4095.0);

    // Cegah pembagian dengan nol jika voltase 0
    if (voltage == 0) {
      Serial.println("Error kalibrasi: Voltase 0");
      return;  // Lewati sampel ini
    }

    float Rs = (VOLTAGE_IN - voltage) * RL_VALUE / voltage;
    calibrationTotalRs += Rs;
    calibrationSampleCount++;

    Serial.print("Sampel kalibrasi ");
    Serial.print(calibrationSampleCount);
    Serial.print("/");
    Serial.print(TOTAL_CALIBRATION_SAMPLES);
    Serial.print(" | Rs: ");
    Serial.println(Rs, 2);

    // 2. Cek apakah sudah selesai
    if (calibrationSampleCount >= TOTAL_CALIBRATION_SAMPLES) {
      float Rs_avg = calibrationTotalRs / TOTAL_CALIBRATION_SAMPLES;

      // LOGIKA UTAMA: Ro adalah nilai Rs di udara bersih
      RO_VALUE = Rs_avg;

      isCalibrating = false;  // Selesai kalibrasi

      Serial.print("\n✅ Kalibrasi selesai. Ro baru = ");
      Serial.println(RO_VALUE, 2);
      saveRoToFlash(RO_VALUE);

      char msg[100];
      sprintf(msg, "Kalibrasi selesai. Ro=%.2f", RO_VALUE);
      client.publish(topic_status, msg);
    }
  }
}

// Fungsi untuk MEMULAI kalibrasi
void startCalibration() {
  // Pastikan sensor ada di UDARA BERSIH sebelum memulai
  Serial.println("\n===== MEMULAI KALIBRASI =====");
  Serial.println("Pastikan sensor berada di udara bersih!");

  isCalibrating = true;
  calibrationSampleCount = 0;
  calibrationTotalRs = 0.0;
  lastCalibrationSampleTime = millis();  // Mulai timer

  client.publish(topic_status, "Kalibrasi dimulai... (Pastikan udara bersih)");
}

// ==========================
// --- Callback MQTT ---
// ==========================
String topicWithId(const char* base) {
  return String(base) + "/" + espId;
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("\n📩 Pesan datang [");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(message);

  // --- PERUBAHAN DI SINI ---
  // Jangan panggil fungsi blocking. Cukup set 'flag' untuk memulai.
  if (String(topic) == topicWithId(topic_calibrate) && message == "CALIBRATE") {
    startCalibration();  // Panggil fungsi yang hanya mengatur flag
  }
}

// ==========================
// --- Koneksi MQTT ---
// ==========================

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Menghubungkan ke MQTT...");
    if (client.connect(espId.c_str())) {
      Serial.println("terhubung!");
      
      String t_calibrate = topicWithId(topic_calibrate);
      client.subscribe(t_calibrate.c_str());

      Serial.println("✅ Subscribe ke topik config & calibrate");
    } else {
      Serial.print("gagal, rc=");
      Serial.print(client.state());
      Serial.println(" coba lagi dalam 2 detik...");
      delay(2000);
    }
  }
}

// ==========================
// --- Setup Arduino ---
// ==========================
void setup() {
  Serial.begin(115200);
  SerialGPS.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  Serial.println("GPS initialized...");

  setupWiFi();

  loadRoFromFlash();

  // Set ADC ke rentang penuh 0-3.3V
  analogSetAttenuation(ADC_11db);

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

// ==========================
// --- Loop Utama ---
// ==========================
void loop() {
  if (!client.connected()) reconnectMQTT();
  client.loop();  // Sangat penting untuk tetap memanggil ini

  while (SerialGPS.available() > 0) {
    gps.encode(SerialGPS.read());
    // Serial.write(SerialGPS.read());
  }

  // If GPS has new data, print it

  // if (gps.location.isUpdated()) {
  Serial.print("Lat: ");
  Serial.print(gps.location.lat(), 6);
  Serial.print(" | Lng: ");
  Serial.print(gps.location.lng(), 6);
  Serial.print(" | Speed: ");
  Serial.print(gps.speed.kmph());
  Serial.print(" km/h | Sats: ");
  Serial.println(gps.satellites.value());
  // }

  // Panggil handler kalibrasi non-blocking di setiap loop
  handleCalibration();

  // Jika sedang kalibrasi, jangan lakukan pembacaan/publish normal
  if (isCalibrating) {
    return;  // Lewati sisa loop agar fokus kalibrasi
  }

  // --- Bagian ini hanya berjalan jika TIDAK sedang kalibrasi ---

  // --- 1. Baca sensor MQ7 ---
  float sensor_volt = analogRead(MQ7_PIN) * (VOLTAGE_IN / 4095.0);
  if (sensor_volt == 0) {
    Serial.println("Error baca sensor: Voltase 0");
    delay(1000);  // Tunggu sebentar sebelum mencoba lagi
    return;
  }
  float Rs = (VOLTAGE_IN - sensor_volt) / sensor_volt * RL_VALUE;
  float ratio = Rs / RO_VALUE;

  // --- 2. Hitung CO ppm ---
  // Menggunakan formula log-log standar yang diturunkan dari datasheet MQ-7
  // (log10(ratio) - b) / m
  // b = intercept (titik potong) ~ 0.37
  // m = slope (kemiringan) ~ -0.557
  float ppm = 10000;
  if (ratio > 0) {
    float ppm_log = (log10(ratio) - 0.37) / -0.557;
    ppm = pow(10, ppm_log);
    if (ppm > 10000) ppm = 10000;
  }

  // --- 3. Tentukan kualitas udara ---
  String status = getStatus(ppm);

  // --- 4. Log ke serial ---
  Serial.print("CO PPM: ");
  Serial.print(ppm, 2);
  Serial.print(" | Status: ");
  Serial.print(status);
  Serial.print(" | Rs: ");
  Serial.print(Rs, 2);
  Serial.print(" | RO: ");
  Serial.println(RO_VALUE, 2);

  // MQTT-PUBLISH
  StaticJsonDocument<256> gpsDoc;
  gpsDoc["lat"] = -7.2735895;
  gpsDoc["lng"] = 112.7109718;
  gpsDoc["device_id"] = espId;
  gpsDoc["speed"] = gps.speed.kmph();
  gpsDoc["sats"] = gps.satellites.value();

  String gpsPayload;
  serializeJson(gpsDoc, gpsPayload);
  client.publish(topic_gps_data, gpsPayload.c_str());

  // --- CO Sensor Payload ---
  StaticJsonDocument<256> dataDoc;
  dataDoc["ppm"] = ppm;
  dataDoc["status"] = status;
  dataDoc["device_id"] = espId;
  dataDoc["ro"] = RO_VALUE;

  String payload;
  serializeJson(dataDoc, payload);
  client.publish(topic_data, payload.c_str());

  delay(10000);
}