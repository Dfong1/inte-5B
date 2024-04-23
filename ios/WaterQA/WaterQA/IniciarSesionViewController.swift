	//
//  IniciarSesionViewController.swift
//  WaterQA
//
//  Created by imac on 26/03/24.
//

import UIKit

class IniciarSesionViewController: UIViewController {
    
    @IBOutlet weak var viewFondo: UIView!
    
    @IBOutlet weak var InputEmail: UITextField!
    @IBOutlet weak var InputPassword: UITextField!
    @IBOutlet weak var homebutton: UIButton!
    @IBOutlet weak var btnIniciarSesion: UIButton!
    @IBOutlet weak var btnRegistrarse: UIButton!
    
    var activityIndicator: UIActivityIndicatorView!
    override func viewDidLoad() {
        super.viewDidLoad()
        viewFondo.layer.cornerRadius = 20.0
        btnIniciarSesion.layer.cornerRadius = 5
        btnRegistrarse.layer.cornerRadius = 5
        
        activityIndicator = UIActivityIndicatorView(style: .large)
                activityIndicator.color = .black
                activityIndicator.center = view.center
                activityIndicator.hidesWhenStopped = true
                view.addSubview(activityIndicator)
        
    }
    
    @IBAction func ActionLogin(_ sender: Any) {
        guard let email = InputEmail.text, !email.isEmpty,
              let password = InputPassword.text, !password.isEmpty else {
            showAlert(message: "Por favor, complete todos los campos.")
            return
        }
        if !isValidEmail(email) {
                showAlert(message: "Por favor, ingrese un correo electrónico válido.")
                return
            }
        activityIndicator.startAnimating()
        
        // Crear la solicitud HTTP
        if let apiUrl = ProcessInfo.processInfo.environment["API_URL"] {
            guard let url = URL(string: "\(apiUrl)/login") else {
                showAlert(message: "La URL de la API es inválida.")
                return
            }
            
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            
            // Crear el cuerpo de la solicitud con los datos del usuario
            let parameters = ["email": email, "password": password]
            request.httpBody = try? JSONSerialization.data(withJSONObject: parameters)
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            
            // Realizar la solicitud HTTP
            URLSession.shared.dataTask(with: request) { data, response, error in
                DispatchQueue.main.async {
                                    self.activityIndicator.stopAnimating()
                                }
                if let error = error {
                    // Error de conexión
                    self.showAlert(message: "Error de conexión: \(error.localizedDescription)")
                    return
                }
                
                guard let httpResponse = response as? HTTPURLResponse else {
                    // Respuesta no válida
                    self.showAlert(message: "Respuesta no válida del servidor.")
                    return
                }
                
                let statusCode = httpResponse.statusCode
                switch statusCode {
                case 200...299:
                    // Solicitud exitosa
                    guard let data = data else {
                        self.showAlert(message: "No se recibieron datos de respuesta.")
                        return
                    }
                    do {
                        if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                            if let token = json["token"] as? String {
                                // Guardar el token en UserDefaults o en el llavero del sistema
                                UserDefaults.standard.set(token, forKey: "AuthToken")
                                
                                // Mostrar mensaje de éxito
                                if let msg = json["msg"] as? String {
                                    DispatchQueue.main.async {
                                        self.showAlertAndNavigate(message: msg)
                                    }
                                }
                            } else {
                                // No se pudo obtener el token de la respuesta de la API
                                self.showAlert(message: "No se pudo obtener el token de la respuesta de la API.")
                            }
                        } else {
                            // No se pudo analizar la respuesta JSON
                            self.showAlert(message: "No se pudo analizar la respuesta de la API.")
                            print("Respuesta JSON recibida: \(String(describing: String(data: data, encoding: .utf8)))")
                        }
                    } catch {
                        // Manejar el error de análisis JSON
                        self.showAlert(message: "Error al analizar JSON de respuesta.")
                        print("Respuesta JSON recibida: \(String(describing: String(data: data, encoding: .utf8)))")
                    }
                default:
                    // Otro código de estado, muestra un mensaje genérico
                    self.showAlert(message: "Error en la solicitud. Código de estado: \(statusCode)")
                }
            }.resume()
        } else {
            print("La variable de entorno API_URL no está definida.")
        }
        
    }
    // Función para mostrar alertas
    func showAlert(message: String) {
        let alert = UIAlertController(title: "Error", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        DispatchQueue.main.async {
            self.present(alert, animated: true, completion: nil)
        }
    }
    // Función para mostrar alerta de éxito y navegar a la siguiente pantalla
    func showAlertAndNavigate(message: String) {
        let alert = UIAlertController(title: "Éxito", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
            // Habilitar el botón de inicio cuando se inicia sesión con éxito
            self.homebutton.isEnabled = true
            self.performSegue(withIdentifier: "home", sender: nil)
            self.homebutton.isEnabled = false
            self.InputEmail.text = ""
            self.InputPassword.text = ""
        }))
        DispatchQueue.main.async {
            self.present(alert, animated: true, completion: nil)
        }
    }
    
    func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    @IBAction func showRegister(_ sender: Any) {
        let objRegister = storyboard?.instantiateViewController(identifier: "Register") as! RegistrarseViewController
        present(objRegister, animated: true, completion: nil)
    }
    
}

