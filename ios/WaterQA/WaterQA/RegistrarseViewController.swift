//
//  RegistrarseViewController.swift
//  WaterQA
//
//  Created by imac on 26/03/24.
//

import UIKit

class RegistrarseViewController: UIViewController {

    @IBOutlet weak var InputEmail: UITextField!
    @IBOutlet weak var InputPasswordConfirmation: UITextField!
    @IBOutlet weak var viewRegFondo: UIView!
    @IBOutlet weak var InputPassword: UITextField!
    @IBOutlet weak var InputName: UITextField!
    @IBOutlet weak var btnRegistrarse: UIButton!
    
    var activityIndicator: UIActivityIndicatorView!
    override func viewDidLoad()
    {
        super.viewDidLoad()
        viewRegFondo.layer.cornerRadius = 20.0
        btnRegistrarse.layer.cornerRadius = 5
        
        activityIndicator = UIActivityIndicatorView(style: .large)
                activityIndicator.color = .black
                activityIndicator.center = view.center
                activityIndicator.hidesWhenStopped = true
                view.addSubview(activityIndicator)
    }
    override func viewDidAppear(_ animated: Bool)
    {
        
    }
    
    @IBAction func ActionRegister(_ sender: Any)
    {
            guard let name = InputName.text, !name.isEmpty,
                  let email = InputEmail.text, !email.isEmpty,
                  let password = InputPassword.text, !password.isEmpty,
                  let passwordConfirmation = InputPasswordConfirmation.text, !passwordConfirmation.isEmpty else {
                showAlert(message: "Por favor, complete todos los campos.")
                return
            }
            
            // Validar mínimo de caracteres en el nombre
            if name.count < 3 {
                showAlert(message: "El nombre debe tener al menos 3 caracteres.")
                return
            }
            
            // Validar formato del correo electrónico
            if !isValidEmail(email) {
                showAlert(message: "Por favor, ingrese un correo electrónico válido.")
                return
            }
            
            // Validar que la contraseña y su confirmación coincidan
            if password != passwordConfirmation {
                showAlert(message: "La contraseña y su confirmación no coinciden.")
                return
            }
        activityIndicator.startAnimating()
            // Crear la solicitud HTTP para el registro
        guard let apiUrl = ProcessInfo.processInfo.environment["API_URL"],
              let url = URL(string: "\(apiUrl)/register") else {
            showAlert(message: "La URL de la API es inválida.")
            return
        }
            
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            
            // Crear el cuerpo de la solicitud con los datos del usuario
            let parameters = ["name": name, "email": email, "password": password]
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
                    // Registro exitoso
                    DispatchQueue.main.async {
                        self.showAlertAndNavigate(message: "Registro exitoso.\n revisa tu correo para poder activar tu cuenta")
                        
                    }
                default:
                    // Otro código de estado, muestra un mensaje genérico
                    self.showAlert(message: "Error en la solicitud. Código de estado: \(statusCode)")
                }
            }.resume()
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
                self.dismiss(animated: true) {
                    self.viewWillAppear(false)
                }
                self.InputName.text = ""
                self.InputEmail.text = ""
                self.InputPassword.text = ""
                self.InputPasswordConfirmation.text = ""
            }))
            DispatchQueue.main.async {
                self.present(alert, animated: true, completion: nil)
            }
        }
        
        // Función para validar el formato del correo electrónico
        func isValidEmail(_ email: String) -> Bool {
            let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
            let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
            return emailPredicate.evaluate(with: email)
        }
}
