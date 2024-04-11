import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from '../interfaces/Environment';
import { Observable } from 'rxjs';
import { ValoresPaquete } from '../interfaces/valores-paquete';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor( private http: HttpClient, ) { }
  private getSensorDataURL = `${api}/api/get/data/sensor/`
  public historial: ValoresPaquete = {
    data: {
      data: {
        propiedades: [],
        valores: []
      },
      fecha: ""
    }
  }

  setData(historial: ValoresPaquete) {
    this.historial = historial
  }

  getData() {
    return this.historial
  }

  getSensorData(id: Number): Observable<ValoresPaquete>{
    return this.http.get<ValoresPaquete>(this.getSensorDataURL + id)
  }



}
