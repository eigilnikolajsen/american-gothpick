/*
    MPU6050 Triple Axis Gyroscope & Accelerometer. Pitch & Roll & Yaw Gyroscope Example.
    Read more: http://www.jarzebski.pl/arduino/czujniki-i-sensory/3-osiowy-zyroskop-i-akcelerometr-mpu6050.html
    GIT: https://github.com/jarzebski/Arduino-MPU6050
    Web: http://www.jarzebski.pl
    (c) 2014 by Korneliusz Jarzebski
*/

#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;
MPU6050 mpu2;

// Timers
unsigned long timer = 0;
float timeStep = 0.01;

// Pitch, Roll and Yaw values
float pitch = 0;
float roll = 0;
float yaw = 0;
float pitch2 = 0;
float roll2 = 0;
float yaw2 = 0;

// Button pins
int BUTTON_PIN_PLAYER1 = 2;
int BUTTON_PIN_PLAYER2 = 3;

void setup() 
{
  Serial.begin(115200);

  // Initialize MPU6050
  while(!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G, 0x68))
  {
    Serial.println("Could not find a valid MPU6050 sensor 1, check wiring!");
    delay(500);
  }
  while(!mpu2.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G, 0x69))
  {
    Serial.println("Could not find a valid MPU6050 sensor 2, check wiring!");
    delay(500);
  }
  
  // Calibrate gyroscope. The calibration must be at rest.
  // If you don't want calibrate, comment this line.
  mpu.calibrateGyro();
  mpu2.calibrateGyro();

  // Set threshold sensivty. Default 3.
  // If you don't want use threshold, comment this line or set 0.
  // mpu.setThreshold(3);

  pinMode(BUTTON_PIN_PLAYER1, INPUT);
  pinMode(BUTTON_PIN_PLAYER2, INPUT);
}

void loop()
{
  timer = millis();

  // Read normalized values
  Vector norm = mpu.readNormalizeGyro();
  Vector norm2 = mpu2.readNormalizeGyro();

  // Calculate Pitch, Roll and Yaw
  pitch = pitch + norm.YAxis * timeStep;
  roll = roll + norm.XAxis * timeStep;
  yaw = yaw + norm.ZAxis * timeStep;
  pitch2 = pitch2 + norm2.YAxis * timeStep;
  roll2 = roll2 + norm2.XAxis * timeStep;
  yaw2 = yaw2 + norm2.ZAxis * timeStep;

  // Output raw
  Serial.print(pitch);
  Serial.print("%");
  Serial.print(roll);
  Serial.print("%");
  Serial.print(yaw);
  Serial.print("%");
  digitalRead(BUTTON_PIN_PLAYER1) == HIGH ? Serial.print("1T") : Serial.print("1F");
  Serial.print("%");
  Serial.print(pitch2);
  Serial.print("%");
  Serial.print(roll2);  
  Serial.print("%");
  Serial.print(yaw2);
  Serial.print("%");
  digitalRead(BUTTON_PIN_PLAYER2) == HIGH ? Serial.print("2T") : Serial.print("2F");
  Serial.println("");

  // Wait to full timeStep period
  delay((timeStep*1000) - (millis() - timer));
}