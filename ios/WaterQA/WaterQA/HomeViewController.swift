//
//  HomeViewController.swift
//  WaterQA
//
//  Created by imac on 09/04/24.
//

import UIKit

class HomeViewController: UIViewController {
    
    @IBOutlet weak var scrPersonajes: UIScrollView!
    
    var paquetes:[Paquete] = []
    override func viewDidLoad() {
        super.viewDidLoad()
        consultarPaquete()
        NotificationCenter.default.addObserver(self, selector: #selector(nuevoPaqueteRegistrado), name: NSNotification.Name(rawValue: "NuevoPaqueteRegistrado"), object: nil)

    }
    
    @objc func nuevoPaqueteRegistrado() {
            // Volver a consultar y cargar los paquetes
            consultarPaquete()
        }
        
        deinit {
            // Darse de baja de la notificación al salir de la vista
            NotificationCenter.default.removeObserver(self)
        }
    
    override func viewDidAppear(_ animated: Bool) {
    }
    
    func consultarPaquete() {
        guard let apiUrl = ProcessInfo.processInfo.environment["API_URL"],
              let url = URL(string: "\(apiUrl)/paquetes") else {
            print("La URL de la API es inválida.")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        guard let token = UserDefaults.standard.string(forKey: "AuthToken") else {
            // Si no se encuentra el token en UserDefaults, muestra una alerta o toma la acción apropiada
            print("No se encontró el token de acceso.")
            return
        }
        // Agregar el token de autorización a la cabecera
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                print("Error al obtener datos: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            
            do {
                let paquetes = try JSONDecoder().decode([Paquete].self, from: data)
                DispatchQueue.main.async {
                    self.paquetes = paquetes
                    self.dibujaPaquete(paquetes: paquetes)
                }
            } catch {
                print("Error al decodificar datos JSON: \(error)")
            }
        }.resume()
    }
    
    
    func dibujaPaquete(paquetes: [Paquete]) {
        var y = 10.0
        let x = 15.0
        let h = 110.0
        let k = 10.0
        let w = scrPersonajes.frame.width - 2*x
        
        for i in 0..<paquetes.count {
            let paquete = paquetes[i]
            
            let vista = UIView(frame: CGRect(x: x, y: y, width: w, height: h))
            vista.backgroundColor = UIColor(red: 111/255.0, green: 206/255.0, blue: 255/255.0, alpha: 255/255.0)
            vista.layer.cornerRadius = 10
            
            let lblNombre = UILabel(frame: CGRect(x: h*0.1, y: 5, width: vista.frame.width - h - 5, height: (h - 10)*0.4))
            lblNombre.text = paquete.nombre
            lblNombre.font = .systemFont(ofSize: 30, weight: .medium)
            lblNombre.adjustsFontSizeToFitWidth = true
            lblNombre.minimumScaleFactor = 0.5
            
            let lblEspecie = UILabel(frame: CGRect(x: h*0.1, y: lblNombre.frame.origin.y + lblNombre.frame.height, width: vista.frame.width - h - 5, height: (h - 10)*0.3))
            lblEspecie.text = paquete.lugar
            lblEspecie.font = .systemFont(ofSize: 26, weight: .regular)
            
            let lblEstatus = UILabel(frame: CGRect(x: h, y: lblEspecie.frame.origin.y + lblEspecie.frame.height, width: vista.frame.width - h - 5, height: (h - 10)*0.3))
            lblEstatus.text = String(paquete.id)
            lblEstatus.font = .systemFont(ofSize: 26, weight: .regular)
            lblEstatus.textAlignment = .right
            
            let lblFecha = UILabel(frame: CGRect(x: h*0.1, y: lblEspecie.frame.origin.y + lblEspecie.frame.height, width: vista.frame.width - h - 5, height: (h - 10)*0.3))
            lblFecha.text = paquete.fecha_de_creacion
            lblFecha.font = .systemFont(ofSize: 26, weight: .regular)
            lblFecha.textAlignment = .left
            
            let btnDetalle = UIButton(frame: CGRect(x: 0, y: 0, width: vista.frame.width, height: vista.frame.height))
            btnDetalle.tag = i
            btnDetalle.addTarget(self, action: #selector(irDetalle(sender:)), for: .touchUpInside)
            
            let switchLed = UISwitch(frame: CGRect(x: CGFloat(vista.frame.width - 80), y: CGFloat((h - 10) * 0.5), width: 60, height: 30))
            switchLed.isOn = paquete.estadoLed // Establecer el estado del switch basado en el estado del LED
            switchLed.addTarget(self, action: #selector(cambiarEstadoLed(_:)), for: .valueChanged)
            switchLed.tag = i // Asignar el índice del paquete como etiqueta al switch
            
            vista.addSubview(lblNombre)
            vista.addSubview(lblEspecie)
            vista.addSubview(lblEstatus)
            vista.addSubview(lblFecha)
            vista.addSubview(btnDetalle)
            vista.addSubview(switchLed) // Agregar el interruptor a la vista
            
            scrPersonajes.addSubview(vista)
            y += h + k
        }
        
        scrPersonajes.contentSize = CGSize(width: 0.0, height: y)
    }


    @objc func irDetalle(sender: UIButton) {
        guard let detailViewController = storyboard?.instantiateViewController(identifier: "detalle") as? DetalleViewController else {
            return
        }
        let selectedPackageId = self.paquetes[sender.tag].esp_id
        detailViewController.packageId = selectedPackageId
        present(detailViewController, animated: true, completion: nil)
    }
    
    
    @objc func cambiarEstadoLed(_ sender: UISwitch) {
        guard let vista = sender.superview, // Obtener la vista que contiene el interruptor
              let index = scrPersonajes.subviews.firstIndex(of: vista) else {
            print("No se pudo encontrar la vista que contiene el interruptor.")
            return
        }
        
        let paquete = paquetes[index]
        let nuevoEstadoLed = sender.isOn ? "1" : "0" // Convertir el estado del interruptor a un string ("1" si está encendido, "0" si está apagado)
        
        guard let apiUrl = ProcessInfo.processInfo.environment["API_URL"],
              let url = URL(string: "\(apiUrl)/change/led/\(paquete.esp_id)")
        else {
            print("La URL de la API es inválida.")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        // Crear el cuerpo de la solicitud como una cadena JSON
        let jsonBody = ["led": nuevoEstadoLed]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: jsonBody)
            
            // Agregar el token de autorización al encabezado
            guard let token = UserDefaults.standard.string(forKey: "AuthToken") else {
                print("No se encontró el token de acceso.")
                return
            }
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            
            // Imprimir el cuerpo de la solicitud
            if let bodyString = String(data: request.httpBody ?? Data(), encoding: .utf8) {
                print("Cuerpo de la solicitud: \(bodyString)")
            }
        } catch {
            print("Error al serializar los datos JSON: \(error)")
            return
        }
        
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error al cambiar el estado del LED: \(error.localizedDescription)")
                // Aquí puedes mostrar una alerta o manejar el error de alguna otra manera
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse else {
                print("Respuesta no válida del servidor al cambiar el estado del LED.")
                return
            }
            
            let statusCode = httpResponse.statusCode
            if statusCode == 200 {
                print("Estado del LED actualizado correctamente.")
                // Aquí puedes realizar alguna acción adicional si el cambio de estado fue exitoso
            } else {
                print("Error al cambiar el estado del LED. Código de estado: \(statusCode)")
                // Aquí puedes mostrar una alerta o manejar el error de alguna otra manera
            }
        }.resume()
    }

}
