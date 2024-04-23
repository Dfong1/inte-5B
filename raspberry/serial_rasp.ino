#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Arduino.h>


// Pines de los sensores
const int pHpin = 34;
const int turbiditypin = 35;
const int tdsPin = 32;
const int oneWireBus = 33;
const int sensorFlujoPin = 27;

// Pines del sensor ultrasónico
#define TRIGGER_PIN 25
#define ECHO_PIN 26

// Pin del LED
const int ledPin = 12;

const int ledPin2 = 13; //rojo
const int ledPin3 = 14; //verde

OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

volatile int contadorPulsos = 0;
float const factorConversor = 7.5; 

void contarPulsos()
{
  contadorPulsos++;
}

void setup()
{
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(ledPin3, OUTPUT);
  // Configuración del pin del sensor de flujo de agua como entrada
  pinMode(sensorFlujoPin, INPUT);

  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  attachInterrupt(digitalPinToInterrupt(sensorFlujoPin), contarPulsos, RISING);
}

void loop()
{
  // Leer datos del puerto serie si están disponibles
  if (Serial.available() > 0) {
    String data = Serial.readString(); // Lee los bytes recibidos y los convierte en una cadena
    Serial.print("data:");
    Serial.println(data);
    char c=data[0]; 
    if (c=='1') {
     Serial.println("True"); // Lee los bytes recibidos y los convierte en una cadena
     digitalWrite(ledPin, HIGH);
     Serial.println("LED encendido");
    } 
    else if(c=='0'){
     Serial.println("False"); // Lee los bytes recibidos y los convierte en una cadena
      digitalWrite(ledPin, LOW);
      Serial.println("LED apagado");
    }
  }
  float pH = analogRead(pHpin);
  float pHValue = mapearPH(pH);

  // Medir la turbidez
  float turbidityValue = medirTurbidez();

  // Lectura del sensor de TDS
  int tdsValue = analogRead(tdsPin);
  float tdsValueMapped = mapearTDS(tdsValue);

  float temperaturaC = obtenerTemperatura();

  // Distancia
  float distancia_cm = obtenerDistanciaUltrasonico();

  if (distancia_cm > 20) {
    digitalWrite(ledPin2, HIGH); 
    digitalWrite(ledPin3, LOW);  
  } else {
    digitalWrite(ledPin2, LOW);  
    digitalWrite(ledPin3, HIGH); 
  }

  // Flujo
  float flujovalue = leerFlujoAgua();

  // Enviar los datos al puerto serial
  Serial.print("TEM01:DS18B20:01:");
  Serial.println(obtenerTemperatura());
  Serial.print("CON01:TDS:01:");
  Serial.println(mapearTDS(analogRead(tdsPin)));
  Serial.print("TUR01:W103:01:");
  Serial.println(convertirTurbidez(analogRead(turbiditypin)));
  Serial.print("NV01:HCSR04:01:");
  Serial.println(distancia_cm);
  Serial.print("PH01:W502:01:");
  Serial.println(mapearPH(analogRead(pHpin)));
  Serial.print("PSN01:YFS201:01:");
  Serial.println(leerFlujoAgua());

  delay(1000);
}

float mapearPH(int valor)
{
  float pHMin = 0.0;
  float pHMax = 14.0;
  float valorMin = 0;
  float valorMax = 4095;

  float pH = map(valor, valorMin, valorMax, pHMin, pHMax);
  return pH;
}

float mapearTDS(int lectura)
{
  const float valorMinimo = 0.0;
  const float valorMaximo = 1000.0;
  const int lecturaMinima = 0;
  const int lecturaMaxima = 4095;

  float valorTDS = map(lectura, lecturaMinima, lecturaMaxima, valorMinimo, valorMaximo);
  return valorTDS;
}

float obtenerTemperatura()
{
  sensors.requestTemperatures();
  return sensors.getTempCByIndex(0);
}

float obtenerDistanciaUltrasonico() {
  digitalWrite(TRIGGER_PIN, LOW);  
  delayMicroseconds(2);            
  digitalWrite(TRIGGER_PIN, HIGH); 
  delayMicroseconds(10);            
  digitalWrite(TRIGGER_PIN, LOW);  

  unsigned long duracion = pulseIn(ECHO_PIN, HIGH);

  float distancia_cm = duracion / 58.0;

  return distancia_cm;
}

float medirTurbidez()
{
  int lecturaTurbidez = analogRead(turbiditypin);

  float nivelTurbidez = convertirTurbidez(lecturaTurbidez);

  return nivelTurbidez;
}

float convertirTurbidez(int lecturaAnaloga)
{
  const int valorMinimo = 0;
  const int valorMaximo = 1023;
  const float turbidezMinima = 0.0;
  const float turbidezMaxima = 100.0;

  float valorTurbidez = map(lecturaAnaloga, valorMinimo, valorMaximo, turbidezMinima, turbidezMaxima);
  return valorTurbidez;
}

float leerFlujoAgua()
{
  noInterrupts();
  int pulsos = contadorPulsos;
  contadorPulsos = 0;
  interrupts();

  float tasaFlujo = pulsos * factorConversor;

  return tasaFlujo;
}
