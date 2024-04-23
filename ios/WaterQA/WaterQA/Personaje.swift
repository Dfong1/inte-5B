//
//  Personaje.swift
//  WaterQA
//
//  Created by imac on 11/04/24.
//

import UIKit

class Personaje: NSObject {
    var nombre = ""
    var estatus = ""
    var especie = ""
    var imagen = ""
    var episodios: [String] = []
    
    init(nombre: String, estatus: String, especie: String, imagen: String)
    {
        self.nombre = nombre
        self.estatus = estatus
        self.especie = especie
        self.imagen = imagen
    }
    
    override var description: String
    {
        return "Nombre: \(nombre) - Especie: \(especie)"
    }
}
