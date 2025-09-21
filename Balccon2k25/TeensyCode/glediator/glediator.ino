#include <OctoWS2811.h>

const int ledsPerStrip = 300;
const int NUM_LEDS = 2400;
const long BAUD_RATE = 1000000;

DMAMEM int displayMemory[ledsPerStrip*6];
int drawingMemory[ledsPerStrip*6];

const int config = WS2811_GRB | WS2811_800kHz;
OctoWS2811 leds(ledsPerStrip, displayMemory, drawingMemory, config);

void setup() {
  pinMode(13, OUTPUT); // Setup the onboard LED for debugging
  digitalWrite(13, LOW);

  leds.begin();
  leds.show();
  Serial.begin(BAUD_RATE);
}

int serialGlediator() {
  while (!Serial.available()) {}
  return Serial.read();
}

void loop() {
  byte r,g,b;
  int i;

  // --- DEBUG Part 1: Wait for start byte ---
  // If the code is stuck here, the onboard LED will stay OFF.
  while (serialGlediator() != 1) {}

  // --- DEBUG Part 2: Blink when start byte is received ---
  // If the start byte is received, the LED will blink quickly.
  digitalWrite(13, HIGH);
  delay(20); // Quick blink
  digitalWrite(13, LOW);

  for (i=0; i < NUM_LEDS; i++) {
    b = serialGlediator();
    r = serialGlediator();
    g = serialGlediator();
    leds.setPixel(i, Color(r,g,b));
  }
  leds.show();
}

unsigned int Color(byte r, byte g, byte b) {
  return (((unsigned int)b << 16) | ((unsigned int)r << 8) | (unsigned int)g);
}