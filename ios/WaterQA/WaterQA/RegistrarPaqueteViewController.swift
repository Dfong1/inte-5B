import UIKit

class RegistrarPaqueteViewController: UIViewController {
    
    @IBOutlet weak var viewFondoAmarillo: UIView!
    @IBOutlet weak var btnRegistrarPaquete: UIButton!
    @IBOutlet weak var inpNombrePaquete: UITextField!
    @IBOutlet weak var inpUbicacionPaquete: UITextField!
    
    var activityIndicator: UIActivityIndicatorView!
    override func viewDidLoad() {
        super.viewDidLoad()
        viewFondoAmarillo.layer.cornerRadius = 20
        btnRegistrarPaquete.layer.cornerRadius = 5
        
        activityIndicator = UIActivityIndicatorView(style: .large)
                activityIndicator.color = .white
                activityIndicator.center = view.center
                activityIndicator.hidesWhenStopped = true
                view.addSubview(activityIndicator)
    }
    
    @IBAction func btnRegistrarPaquete(_ sender: Any) {
        guard let nombre = inpNombrePaquete.text, !nombre.isEmpty,
              let lugar = inpUbicacionPaquete.text, !lugar.isEmpty else {
            mostrarAlert(mensaje: "Por favor completa todos los campos.")
            return
        }
        activityIndicator.startAnimating()

        guard let token = UserDefaults.standard.string(forKey: "AuthToken") else {
            // Si no se encuentra el token en UserDefaults, muestra una alerta o toma la acción apropiada
            mostrarAlert(mensaje: "No se encontró el token de acceso.")
            return
        }
        
        // Usar el token obtenido para hacer la solicitud para crear el paquete
        crearPaquete(token: token, nombre: nombre, lugar: lugar)
    }
    
    func crearPaquete(token: String, nombre: String, lugar: String) {
        guard let apiUrl = ProcessInfo.processInfo.environment["API_URL"],
              let url = URL(string: "\(apiUrl)/paquete/create") else {
            mostrarAlert(mensaje:"La URL de la API es inválida.")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        // Agregar el token de autorización a la cabecera
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let parameters = ["nombre": nombre, "lugar": lugar]
        request.httpBody = try? JSONSerialization.data(withJSONObject: parameters)
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                                self.activityIndicator.stopAnimating()
                            }
            if let error = error {
                self.mostrarErrorAlert(message: "Error de conexión: \(error.localizedDescription)")
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse else {
                self.mostrarErrorAlert(message: "Respuesta no válida del servidor.")
                return
            }
            
            let statusCode = httpResponse.statusCode
            switch statusCode {
            case 200...299:
                DispatchQueue.main.async {
                    self.showAlertAndNavigate(message: "El paquete se registró exitosamente")
                }
            default:
                self.mostrarErrorAlert(message: "Error en el servidor. Código de estado: \(statusCode)")
            }
        }.resume()
    }
    
    func mostrarErrorAlert(message: String) {
        let alert = UIAlertController(title: "Error", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        DispatchQueue.main.async {
            self.present(alert, animated: true, completion: nil)
        }
    }
    
    func mostrarAlert(mensaje: String) {
        let alerta = UIAlertController(title: "¡Campos vacíos!", message: mensaje, preferredStyle: .alert)
        alerta.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(alerta, animated: true, completion: nil)
    }
    
    func showAlertAndNavigate(message: String) {
        let alert = UIAlertController(title: "Éxito", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
            NotificationCenter.default.post(name: NSNotification.Name(rawValue: "NuevoPaqueteRegistrado"), object: nil)
            self.dismiss(animated: true, completion: nil)
            self.inpNombrePaquete.text = ""
            self.inpUbicacionPaquete.text = ""
        }))
        DispatchQueue.main.async {
            self.present(alert, animated: true, completion: nil)
        }
    }

}
