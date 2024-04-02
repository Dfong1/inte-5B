import { Injectable } from '@angular/core';
import { api } from '../interfaces/Environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paquetes } from '../interfaces/paquetes';
import { CreatePaquete } from '../interfaces/create-paquete';

@Injectable({
  providedIn: 'root'
})
export class PaquetesService {

  private getPaquetesURL = `${api}/api/paquetes`
  private createPaqueteURL = `${api}/api/paquete/create`
  private updatePaqueteURL = `${api}/api/paquete/editar`
  private deletePaqueteURL = `${api}/api/paquete/delete`

  constructor( private http: HttpClient ) { }

  getPaquetes(): Observable<Paquetes[]>{
    return this.http.get<Paquetes[]>(this.getPaquetesURL)
  }

  createPaquete(paquete: CreatePaquete): Observable<Paquetes> {
    return this.http.post<Paquetes>(this.createPaqueteURL, paquete)
  }

}
