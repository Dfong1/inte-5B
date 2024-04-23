import UIKit

struct HistorialResponse: Codable {
    let data: [HistorialItem]
}

class HistorialViewController: UIViewController {
    
    var packageId: String?
    var historialData: [HistorialItem] = [] // Array para almacenar los datos del historial
    var activityIndicator: UIActivityIndicatorView! // Declara el activity indicator
    var scrollView: UIScrollView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Inicializa y configura el activity indicator
        activityIndicator = UIActivityIndicatorView(style: .large)
        activityIndicator.color = .black
        activityIndicator.center = view.center
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)
        
        scrollView = UIScrollView(frame: view.bounds)
        scrollView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(scrollView)
        
        // Iniciar el polling para obtener el historial
        iniciarPollingHistorial()
    }
    
    
    func iniciarPollingHistorial() {
        activityIndicator.startAnimating() // Inicia la animación del activity indicator
        
        Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { timer in
            guard let apiurl = ProcessInfo.processInfo.environment["API_URL"],
                  let packageId = self.packageId,
                  let url = URL(string: "\(apiurl)/historial/\(packageId)") else {
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
                    guard let jsonData = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                          let dataDict = jsonData["data"] as? [String: Any],
                          let historialItems = dataDict["data"] as? [[String: Any]] else {
                        print("Error al obtener datos del historial")
                        return
                    }
                    
                    DispatchQueue.main.async {
                        self.activityIndicator.stopAnimating() // Detiene la animación del activity indicator
                        self.mostrarDatosEnVistas(historialItems)
                    }
                } catch {
                    print("Error al decodificar datos JSON: \(error)")
                }
            }.resume()
        }
    }

    func mostrarDatosEnVistas(_ historialItems: [[String: Any]]) {
        var yPosition: CGFloat = 50.0 // Posición vertical inicial
        let viewHeight: CGFloat = 220.0 // Altura de cada vista
        let backgroundColor = UIColor(red: 0.529, green: 0.808, blue: 0.922, alpha: 1.0) // Color azul cielo
        
        // Limitar el número de elementos a mostrar a los primeros 10
        let itemsToShow = Array(historialItems.prefix(10))
        
        for historialItem in itemsToShow {
            guard let fecha = historialItem["fecha"] as? String,
                  let pH01 = historialItem["PH01"] as? String,
                  let psn01 = historialItem["PSN01"] as? String,
                  let tem01 = historialItem["TEM01"] as? String,
                  let con01 = historialItem["CON01"] as? String,
                  let tur01 = historialItem["TUR01"] as? String,
                  let nv01 = historialItem["NV01"] as? String else {
                continue
            }
            
            let historialView = UIView(frame: CGRect(x: 20.0, y: yPosition, width: view.bounds.width - 40.0, height: viewHeight))
            historialView.backgroundColor = backgroundColor
            historialView.layer.cornerRadius = 10.0
            scrollView.addSubview(historialView)
            
            let fechaLabel = UILabel(frame: CGRect(x: 10.0, y: 10.0, width: historialView.bounds.width - 20.0, height: 20.0))
            fechaLabel.text = "Fecha: \(fecha)"
            historialView.addSubview(fechaLabel)
            
            let pHLabel = UILabel(frame: CGRect(x: 10.0, y: 40.0, width: historialView.bounds.width - 20.0, height: 20.0))
            pHLabel.text = "pH: \(pH01)"
            historialView.addSubview(pHLabel)
            
            let psnLabel = UILabel(frame: CGRect(x: 10.0, y: 70.0, width: historialView.bounds.width - 20.0, height: 20.0))
            psnLabel.text = "PSN: \(psn01)"
            historialView.addSubview(psnLabel)

            let temLabel = UILabel(frame: CGRect(x: 10.0, y: 100.0, width: historialView.bounds.width - 20.0, height: 20.0))
            temLabel.text = "TEM: \(tem01)"
            historialView.addSubview(temLabel)

            let conLabel = UILabel(frame: CGRect(x: 10.0, y: 130.0, width: historialView.bounds.width - 20.0, height: 20.0))
            conLabel.text = "CON: \(con01)"
            historialView.addSubview(conLabel)

            let turLabel = UILabel(frame: CGRect(x: 10.0, y: 160.0, width: historialView.bounds.width - 20.0, height: 20.0))
            turLabel.text = "TUR: \(tur01)"
            historialView.addSubview(turLabel)

            let nvLabel = UILabel(frame: CGRect(x: 10.0, y: 190.0, width: historialView.bounds.width - 20.0, height: 20.0))
            nvLabel.text = "NV: \(nv01)"
            historialView.addSubview(nvLabel)
            
            yPosition += viewHeight + 20.0 // Incrementar la posición vertical para la próxima vista con un espacio adicional
        }
        
        // Ajustar el tamaño del contenido del scrollView
        scrollView.contentSize = CGSize(width: scrollView.bounds.width, height: yPosition)
    }
}
