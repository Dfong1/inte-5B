import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from '../interfaces/Environment';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor( private http: HttpClient, ) { }
  private getSensorDataURL = `${api}/api/historial/`

  getSensorData(id: Number){
    return this.http.get(this.getSensorDataURL + id)
  }

}
