import UIKit

class DatosViewController: UIViewController {
    var packageId: String?
    var valores: [String] = []
    var propiedades: [String] = []
    var activityIndicator: UIActivityIndicatorView! // Declara el activity indicator
    
    @IBOutlet weak var PaqueteIdentifier: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Inicializa y configura el activity indicator
        activityIndicator = UIActivityIndicatorView(style: .large)
        activityIndicator.color = .black
        activityIndicator.center = view.center
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)
        
        iniciarPolling()
    }
    
    func iniciarPolling() {
        activityIndicator.startAnimating() // Inicia la animación del activity indicator
        
        Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { timer in
            guard let apiurl = ProcessInfo.processInfo.environment["API_URL"],
                  let packageId = self.packageId,
                  let url = URL(string: "\(apiurl)/historial/app/\(packageId)") else {
                print("La URL de la API es inválida.")
                return
            }
            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            
            guard let token = UserDefaults.standard.string(forKey: "AuthToken") else {
                print("No se encontró el token de acceso.")
                return
            }
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            
            URLSession.shared.dataTask(with: request) { data, response, error in
                guard let data = data, error == nil else {
                    print("Error al obtener datos: \(error?.localizedDescription ?? "Unknown error")")
                    return
                }
                
                do {
                    let jsonData = try JSONSerialization.jsonObject(with: data) as? [String: Any]
                    if let dataDict = jsonData?["data"] as? [String: Any],
                       let valoresArray = dataDict["data"] as? [String: Any],
                       let valores = valoresArray["valores"] as? [String],
                       let propiedades = valoresArray["propiedades"] as? [String] {
                        self.valores = valores
                        self.propiedades = propiedades
                        
                        DispatchQueue.main.async {
                            self.actualizarVistaConDatos()
                            self.activityIndicator.stopAnimating() // Detiene la animación del activity indicator
                        }
                    } else if let jsonData = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                              let message = jsonData["message"] as? String,
                              message == "No Hay datos registrados" {
                        DispatchQueue.main.async {
                            self.mostrarMensaje(message)
                            self.activityIndicator.stopAnimating() // Detiene la animación del activity indicator
                        }
                    }
                } catch {
                    print("Error al decodificar datos JSON: \(error)")
                }
            }.resume()
        }
    }
    
    func actualizarVistaConDatos() {
        // Eliminar vistas anteriores antes de agregar nuevas
        for subview in view.subviews {
            if let propiedadValorView = subview as? PropiedadValorView {
                propiedadValorView.removeFromSuperview()
            }
        }
        
        // Crear y agregar PropiedadValorView para cada propiedad y valor
        var xPosition: CGFloat = 20.0 // Posición horizontal inicial
        var yPosition: CGFloat = 100.0 // Posición vertical inicial
        var columnCounter = 0 // Contador de columnas
        let viewWidth = (view.frame.width - 60) / 2 // Ancho de cada vista con margen
        let viewHeight: CGFloat = 90.0 // Altura de cada vista
        
        for (index, propiedad) in propiedades.enumerated() {
            if columnCounter == 2 { // Reiniciar posición horizontal cada dos vistas
                xPosition = 20.0
                yPosition += viewHeight + 20.0 // Incrementar la posición vertical para la próxima fila
                columnCounter = 0 // Reiniciar el contador de columnas
            }
            
            let propiedadValorView = PropiedadValorView(frame: CGRect(x: xPosition, y: yPosition, width: viewWidth, height: viewHeight))
            propiedadValorView.propiedad = propiedad
            propiedadValorView.valor = valores[index]
            
            let gradientLayer = CAGradientLayer()
            gradientLayer.frame = propiedadValorView.bounds
            gradientLayer.colors = [UIColor(red: 111/255.0, green: 206/255.0, blue: 255/255.0, alpha: 1.0).cgColor, UIColor.white.cgColor]
            gradientLayer.startPoint = CGPoint(x: 0.0, y: 0.5)
            gradientLayer.endPoint = CGPoint(x: 1.0, y: 0.5)

            // Redondear los bordes
            propiedadValorView.layer.cornerRadius = 10.0
            propiedadValorView.layer.masksToBounds = true
            
            propiedadValorView.layer.insertSublayer(gradientLayer, at: 0)
            view.addSubview(propiedadValorView)
            
            xPosition += viewWidth + 20.0 // Incrementar la posición horizontal para la próxima vista
            columnCounter += 1 // Incrementar el contador de columnas
        }
    }
    
    func mostrarMensaje(_ mensaje: String) {
        let mensajeLabel = UILabel()
        mensajeLabel.translatesAutoresizingMaskIntoConstraints = false
        mensajeLabel.text = mensaje
        mensajeLabel.textAlignment = .center
        mensajeLabel.numberOfLines = 0
        
        view.addSubview(mensajeLabel)
        
        NSLayoutConstraint.activate([
            mensajeLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            mensajeLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
}
