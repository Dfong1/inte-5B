//
//  Paquete.swift
//  WaterQA
//
//  Created by imac on 11/04/24.
//

import UIKit

class Paquete: Decodable {
        let id: Int
        let nombre: String
        let lugar: String
        let status: Int
        let esp_id: String
        let led: Int
        let user_id: Int
        let fecha_de_creacion: String
        
        // Enum para mapear el status a un valor más significativo
        enum Led: Int {
            case activo = 1
            case inactivo = 0
        }
    var estadoLed: Bool {
            return led == Led.activo.rawValue
        }

}
