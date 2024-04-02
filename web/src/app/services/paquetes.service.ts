import { Injectable } from '@angular/core';
import { api } from '../interfaces/Environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paquetes } from '../interfaces/paquetes';
import { CreatePaquete } from '../interfaces/create-paquete';
import { Messages } from '../interfaces/messages';

@Injectable({
  providedIn: 'root'
})
export class PaquetesService {

  private getPaquetesURL = `${api}/api/paquetes`
  private getPaqueteURL = `${api}/api/buscar/paquete/`
  private createPaqueteURL = `${api}/api/paquete/create`
  private updatePaqueteURL = `${api}/api/edit/paquete/`
  private deletePaqueteURL = `${api}/api/status/paquete/`
  private turnOnLedURL = `${api}/api/change/led/`

  constructor( private http: HttpClient ) { }

  getPaquetes(): Observable<Paquetes[]>{
    return this.http.get<Paquetes[]>(this.getPaquetesURL)
  }
  getPaquete(id: Number): Observable<Paquetes>{
    return this.http.get<Paquetes>(this.getPaqueteURL + id)
  }

  createPaquete(paquete: CreatePaquete): Observable<Paquetes> {
    return this.http.post<Paquetes>(this.createPaqueteURL, paquete)
  }
  editPaquete(paquete: CreatePaquete, id: Number): Observable<Messages> {
    return this.http.put<Messages>(this.updatePaqueteURL + id, paquete )
  }

  deletePaquete(id: Number): Observable<Messages> {
    return this.http.delete<Messages>(this.deletePaqueteURL + id)
  }
  turnOnLed(id: Number){
    return this.http.put(this.turnOnLedURL + id, {})
  }

}
