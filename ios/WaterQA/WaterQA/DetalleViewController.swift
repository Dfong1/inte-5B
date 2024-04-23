//
//  DetalleViewController.swift
//  WaterQA
//
//  Created by imac on 11/04/24.
//

import UIKit

class DetalleViewController: UITabBarController {
    var packageId: String?
        
        override func viewDidLoad() {
            super.viewDidLoad()
            // Configurar packageId
            
            // Obtener una referencia a DataViewController y establecer packageId
            if let dataViewController = viewControllers?[0] as? DatosViewController {
                dataViewController.packageId = packageId
            }
            
            // Obtener una referencia a HistorialViewController y establecer packageId
            if let historialViewController = viewControllers?[1] as? HistorialViewController {
                historialViewController.packageId = packageId
            }
        }
}
