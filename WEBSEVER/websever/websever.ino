#include <SPIFFS.h>
#include <WiFi.h> 
#include <ESPAsyncWebServer.h>
#include <SimpleKalmanFilter.h>
#include <FS.h>

#define ADC_PIN_CELESTO 8   // Chân ADC cho Celesco SP1-12
#define ADC_PIN_TORQUE 9    // Chân ADC cho Torque YDR
#define ENCODER_PIN_A 34    // Chân encoder A
#define ENCODER_PIN_B 35    // Chân encoder B

// Wi-Fi 
const char* ssid = "VanDat";
const char* password = "thanhdatanh";

// Đặt biến toàn cục 
AsyncWebServer server(80);
bool wifiConnected = false;

volatile float distance = 0.0;
volatile float torque = 0.0;
volatile long encoderCount = 0;   
volatile long encoder = 0;

// Kalman Filters 
SimpleKalmanFilter kalmanFilter1(2, 2, 0.01);
SimpleKalmanFilter kalmanFilter2(2, 2, 0.01);

// Encoder counting
void IRAM_ATTR readEncoder() 
{
  static int lastStateA = LOW;
  int stateA = digitalRead(ENCODER_PIN_A);
  int stateB = digitalRead(ENCODER_PIN_B);
  if (stateA != lastStateA) 
  {
    if (stateA == stateB) 
    {
      encoderCount = encoderCount + 1;  
    } else {
      encoderCount = encoderCount - 1;
    }
  }
  lastStateA = stateA;
}
  
void setup() {
  Serial.begin(115200);
  
  // Operate SPIFFS for HTML/CSS/JS file storage
  if (!SPIFFS.begin(true)) {
    Serial.println("ERROR while mounting SPIFFS");
    return;
  } else {
    Serial.println("SPIFFS mounted successfully");
  }
  
  checkSPIFFSFiles();
  connectToWiFi();
  
  // Initialize ADC pins
  analogReadResolution(12); // 12-bit ADC resolution (0-4095)
  pinMode(ADC_PIN_CELESTO, INPUT);
  pinMode(ADC_PIN_TORQUE, INPUT);

  // Initialize encoder pins
  pinMode(ENCODER_PIN_A, INPUT);
  pinMode(ENCODER_PIN_B, INPUT);

  // Attach interrupts for encoder
  attachInterrupt(digitalPinToInterrupt(ENCODER_PIN_A), readEncoder, CHANGE);
  attachInterrupt(digitalPinToInterrupt(ENCODER_PIN_B), readEncoder, CHANGE);
  
  setupServer();
  server.begin();
  Serial.println("Server is ready");
}

void loop() {
  
  int rawDistance = analogRead(ADC_PIN_CELESTO);
  int rawTorque = analogRead(ADC_PIN_TORQUE);
  int encoder = ((encoderCount*2*1000)/10)/10;
  
  //Kalman filter
  float Dis = kalmanFilter1.updateEstimate(rawDistance);
  float Tor = kalmanFilter2.updateEstimate(rawTorque);
  distance = (Dis/((4094 - 20)/317.5)); //(((Dis*(5.0/900))*(317/4.4)));
  torque = (0.008*Tor)*10.0;  // 10.8V full tải 4N.m --- 0.2V không tải --- tăng 1N.m nhân cho 2.65 (10.8V-0.2V)/4Nm= 2.65
  
  Serial.print("Distance: ");
  Serial.println(distance);
  Serial.print("Torque: ");
  Serial.println(torque);
  Serial.print("Count: ");   
  Serial.println(encoder);       
  encoderCount=0;
  
  delay(100); 
}

void connectToWiFi() {
    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) 
    {
     delay(100);
     Serial.println(WiFi.status());
    }
    Serial.println("WiFi Connected");
    Serial.println(ssid); 
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    wifiConnected = true;
}

void setupServer() {
  // Serve HTML files
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index1.html", "text/html");
  });
  server.on("/index1.html", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index1.html", "text/html");
  });
  server.on("/index2.html", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index2.html", "text/html");
  });
  server.on("/index3.html", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index3.html", "text/html");
  });

  // Serve CSS files
  server.on("/css/main.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/css/main.css", "text/css");
  });
  server.on("/css/base.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/css/base.css", "text/css");
  });
  server.on("/css/responsive.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/css/responsive.css", "text/css");
  });

  // Serve JavaScript files
  server.on("/java/script.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/java/script.js", "text/javascript");
  });

  // Serve sensor data
  server.on("/distance", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/plain", String(distance, 2).c_str());
  });
  server.on("/torque", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/plain", String(torque, 2).c_str());
  });
  server.on("/encoder", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/plain", String(encoder, 2).c_str());
  });
//  server.on("/power", HTTP_GET, [](AsyncWebServerRequest *request){
 //   request->send_P(200, "text/plain", String(power, 2).c_str());
//  });
  
  // Command handling routes
  server.on("/start", HTTP_POST, [](AsyncWebServerRequest *request){
    if (request->hasParam("data", true)) {
      String data = request->getParam("data", true)->value();
      data.replace(" ", "\n");
      String formattedData = formatCoordinates(data);
      handleCommand(request, formattedData);
    } else {
      handleCommand(request, "START");
    }
  });
  server.on("/stop", HTTP_POST, [](AsyncWebServerRequest *request){
    handleCommand(request, "STOP");
  });
  server.on("/reset", HTTP_POST, [](AsyncWebServerRequest *request){
    handleCommand(request, "RESET");
  });
  server.on("/export", HTTP_POST, [](AsyncWebServerRequest *request){
    handleCommand(request, "EXPORT");
  });
  server.on("/xyz", HTTP_POST, [](AsyncWebServerRequest *request){
    if (request->hasParam("data", true)) {
      String data = request->getParam("data", true)->value();
      handleCommand(request, "xyz," + data);
    } else {
      request->send(400, "text/plain", "Missing data parameter");
    }
  });
}

String formatCoordinates(const String& data) {
  String formattedData;
  int start = 0;
  int end = data.indexOf('\n');

  while (end != -1) {
    formattedData += "GOTO " + data.substring(start, end) + "\n";
    start = end + 1;
    end = data.indexOf('\n', start);
  }

  formattedData += "GOTO " + data.substring(start) + "\n";
  return formattedData;
}

void handleCommand(AsyncWebServerRequest *request, const String& command) {
  Serial.println(command);  // In lệnh nhận được lên Serial
  request->send(200, "text/plain", "Command sent: " + command);
}

void processReceivedData(char* data) {
  char* token = strtok(data, ",");
  while (token != NULL) {
    if (strncmp(token, "D:", 2) == 0) {
      distance = atof(token + 2); // Distance from sensor 1
    } else if (strncmp(token, "T:", 2) == 0) {
      torque = atof(token + 2); // Torque from sensor 2
    } else if (strncmp(token, "E:", 2) == 0) {
      encoder = atof(token + 2); // Encoder count
    }
    token = strtok(NULL, ",");
  }  
  Serial.print("Distance: ");
  Serial.println(distance);
  Serial.print("Torque: ");
  Serial.println(torque);
  Serial.print("Count: ");
  Serial.println(encoder);
}

void checkSPIFFSFiles() {
  const char* files[] = {
    "/index1.html",
    "/index2.html",  
    "/index3.html",
    "/css/main.css",
    "/css/base.css",
    "/css/responsive.css",
    "/java/script.js"
  };

  for (int i = 0; i < sizeof(files) / sizeof(files[0]); i++) {
    if (!SPIFFS.exists(files[i])) {
      Serial.printf("%s not found\n", files[i]);
    } else {
      Serial.printf("%s is available\n", files[i]);
    }
  }
}
