import json
from datetime import datetime
import serial
import requests
import websocket

class SensorController:
    def init(self):
        self.api_url = "http://192.168.1.13:8000/api/historial/save"
        self.puerto_serial = '/dev/ttyUSB0'
        self.ser = serial.Serial(self.puerto_serial, 9600)

    def enviar_api(self, data):
        try:
            response = requests.post(self.api_url, json=data)
            if response.status_code == 201:
                print("Datos enviados correctamente a la API")
            else:
                print(f"Error al enviar datos a la API. Código de estado: {response.status_code}")
        except requests.RequestException as e:
            print(f"Error de conexión: {e}")

    def leer_sensor(self):
        data = {"data": {}, "paquete_id": None, "fecha": None}
        while True:
            linea = self.ser.readline().decode('utf-8').strip()
            partes = linea.split(':')

            if len(partes) >= 4:
                nombre_sensor = partes[0]
                valor_sensor = partes[3]
                paquete_id = partes[2]

                if data["paquete_id"] is None:
                    data["paquete_id"] = paquete_id
                if data["fecha"] is None:
                    data["fecha"] = datetime.now().strftime("%Y/%m/%d")

                data["data"][nombre_sensor] = valor_sensor
                data["data"]["fecha"] = datetime.now().strftime("%Y/%m/%d")
                data["data"]["paquete_id"] = paquete_id

                if len(data["data"]) == 8:
                    # Enviar los datos
                    self.enviar_api(data)
                    # Reiniciar el diccionario para la próxima iteración
                    data = {"data": {}, "paquete_id": None, "fecha": None}

            else:
                print("Formato de línea no válido. Los datos no fueron enviados a la API.")

    def on_message(self, ws, message):
        message_json = json.loads(message)
        data = json.loads(message_json['data'])
        led_status = data['led']
        print("Enviando:", led_status)
        # Conexión serial
        val = None
        if led_status:
            val = b'1'
        else:
            val = b'0'
        self.serial_enviar(val)
        print("val:", val)
        self.ser.write(val)
        self.ser.close()

    def on_error(self, ws, error):
        print(error)

    def on_close(self, ws):
        print("### closed ###")

    def on_open(self, ws):
        ws.send(json.dumps({
            'event': 'pusher:subscribe',
            'data': {
                'channel': 'change_led'
            }
        }))

    def iniciar(self):
        # Iniciar el websocket
        ws = websocket.WebSocketApp("ws://192.168.254.208:6001/app/123",
                                    on_message=self.on_message,
                                    on_error=self.on_error,
                                    on_close=self.on_close)
        ws.on_open = self.on_open
        ws.run_forever()

    def serial_enviar(self, val):
        with serial.Serial('/dev/ttyUSB0', 9600) as ser:
            ser.flushInput()
            ser.flushOutput()
            print (ser.portstr)       # check which port was really used
            ser.write(val)      # write a string
            response = ser.readline()
            print(response)
            response = ser.readline()
            print(response)
            response = ser.readline()
            print(response)
            ser.close()             # close port

if name == "main":
    controller = SensorController()
    controller.iniciar()
    controller.leer_sensor()