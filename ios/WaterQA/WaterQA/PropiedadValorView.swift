import UIKit

class PropiedadValorView: UIView {
    var propiedad: String? {
        didSet {
            propiedadLabel.text = propiedad
        }
    }
    
    var valor: String? {
        didSet {
            valorLabel.text = valor
        }
    }
    
    private let propiedadLabel: UILabel = {
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.font = UIFont.systemFont(ofSize: 16, weight: .bold)
        label.textColor = UIColor.black
        label.textAlignment = .center // Alineación centrada
        return label
    }()
    
    private let valorLabel: UILabel = {
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.font = UIFont.systemFont(ofSize: 14, weight: .regular)
        label.textColor = UIColor.darkGray
        label.textAlignment = .center // Alineación centrada
        return label
    }()
    
    // Inicialización
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        setupViews()
    }
    
    private func setupViews() {
        // Agregar fondo blanco y borde redondeado
        backgroundColor = UIColor.white
        layer.cornerRadius = 12 // Aumenta el radio de la esquina para hacerlo más cuadrado
        layer.borderWidth = 2 // Aumenta el ancho del borde
        layer.borderColor = UIColor.black.cgColor
        
        // Agregar subvistas
        addSubview(propiedadLabel)
        addSubview(valorLabel)
        
        // Configurar restricciones
        NSLayoutConstraint.activate([
            propiedadLabel.topAnchor.constraint(equalTo: topAnchor, constant: 10),
            propiedadLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 10),
            propiedadLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -10),
            propiedadLabel.centerXAnchor.constraint(equalTo: centerXAnchor), // Centrar horizontalmente
            
            
            valorLabel.topAnchor.constraint(equalTo: propiedadLabel.bottomAnchor, constant: 5),
            valorLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 10),
            valorLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -10),
            valorLabel.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -10),
            valorLabel.centerXAnchor.constraint(equalTo: centerXAnchor) // Centrar horizontalmente
        ])
    }
    
    // Configurar el tamaño de las vistas
    override var intrinsicContentSize: CGSize {
        return CGSize(width: 120, height: 120) // Tamaño más cuadrado para que se vea mejor
    }
}
