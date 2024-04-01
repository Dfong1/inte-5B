import { Injectable } from '@angular/core';
import { api } from '../interfaces/Environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paquetes } from '../interfaces/paquetes';

@Injectable({
  providedIn: 'root'
})
export class PaquetesService {

  private getPaquetesURL = `${api}/api/paquetes`
  constructor( private http: HttpClient ) { }

  getPaquetes(): Observable<Paquetes[]>{
    return this.http.get<Paquetes[]>(this.getPaquetesURL)
  }

}
