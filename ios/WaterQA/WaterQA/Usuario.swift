//
//  Usuario.swift
//  WaterQA
//
//  Created by Federico Mireles on 19/04/24.
//

import UIKit

struct Usuario: Decodable {
    let id: Int
    let name: String
    let email: String
    let password: String
    let status: Int
}
