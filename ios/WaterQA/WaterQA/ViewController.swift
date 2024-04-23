import UIKit

class ViewController: UIViewController {

    let defaults = UserDefaults.standard
    @IBOutlet weak var imvSplash: UIImageView!
    
    @IBOutlet weak var home2: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        imvSplash.frame.origin = CGPoint(x: (view.frame.width - imvSplash.frame.width)/2.0, y: -imvSplash.frame.height)
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        UIView.animate(withDuration: 1.5) {
            self.imvSplash.frame.origin.y = (self.view.frame.height - self.imvSplash.frame.height)/2.0
        } completion: { res in
            Timer.scheduledTimer(withTimeInterval: 0.5, repeats: false) { timer in
                self.presentarLogin()
            }
        }
        
    }
    func presentarLogin() {
           // Si hay sesión, retorna
           if evaluarSesion() {
               self.home2.isEnabled = true
               self.performSegue(withIdentifier: "home2", sender: nil)
               self.home2.isEnabled = false
           } else {
               let objLogin = storyboard?.instantiateViewController(withIdentifier: "InicioSesion") as! IniciarSesionViewController
               // Configurar modalPresentationStyle a fullScreen
               objLogin.modalPresentationStyle = .fullScreen
               present(objLogin, animated: true, completion: nil)
           }
       }
    func evaluarSesion()->Bool{
        var succes = false
        let token = defaults.object(forKey: "AuthToken") as? String ?? ""
        if token.count > 0 {
            succes = true
        }
        else{
            succes = false
        }
        return succes
    }
}
