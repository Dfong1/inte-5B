import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from '../interfaces/Environment';
import { Observable } from 'rxjs';
import { ValoresPaquete } from '../interfaces/valores-paquete';
import { Estadisitca } from '../interfaces/estadisitca';
import { Historial } from '../interfaces/historial';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor( private http: HttpClient, ) { }
  private getSensorDataURL = `${api}/api/get/data/sensor/`
  private getAverageURL = `${api}/api/historial/avarage`
  private getHistorialURL = `${api}/api/historial/`

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

  getAvarage(sensor: string, paquete_id: string): Observable<Estadisitca> {
    return this.http.post<Estadisitca>(this.getAverageURL, {
      sensor: sensor,
      paquete_id: paquete_id
    })
  }

  getHistorial(id: Number): Observable<Historial> {
    return this.http.get<Historial>(this.getHistorialURL + id)
  }




}
