import UIKit

class PerfilViewController: UIViewController {
    
    @IBOutlet weak var imvFondoAmarillo: UIImageView!
    @IBOutlet weak var btnCerrarSesión: UIButton!
    @IBOutlet weak var Correo: UITextField!
    @IBOutlet weak var NombreUsuario: UITextField!
    
    let defaults = UserDefaults.standard
    
    override func viewDidLoad() {
        super.viewDidLoad()
        imvFondoAmarillo.layer.cornerRadius = 20
        btnCerrarSesión.layer.cornerRadius = 5
        consultarDatos()
    }
    
    @IBAction func CerrarSesión(_ sender: Any) {
        defaults.removeObject(forKey: "AuthToken")
        dismiss(animated: true) {
            self.viewWillAppear(false)
        }
    }
    
    func consultarDatos() {
        guard let apiUrl = ProcessInfo.processInfo.environment["API_URL"],
              let url = URL(string: "\(apiUrl)/user") else {
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
                let usuario = try JSONDecoder().decode(Usuario.self, from: data)
                DispatchQueue.main.async {
                    self.actualizarInterfazConUsuario(usuario)
                }
            } catch {
                print("Error al decodificar datos JSON: \(error)")
            }
        }.resume()
    }
    
    func actualizarInterfazConUsuario(_ usuario: Usuario) {
        NombreUsuario.text = usuario.name
        Correo.text = usuario.email
    }
}
