import Foundation

struct HistorialItem: Codable {
    let id: String
    let pH01: String
    let fecha: String
    let paqueteId: String
    let psn01: String
    let tem01: String
    let con01: String
    let tur01: String
    let nv01: String

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case pH01
        case fecha
        case paqueteId = "paquete_id"
        case psn01 = "PSN01"
        case tem01 = "TEM01"
        case con01 = "CON01"
        case tur01 = "TUR01"
        case nv01 = "NV01"
    }
}
