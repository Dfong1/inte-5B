import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/Login';
import { api }  from '../interfaces/Environment'
import { Token } from '../interfaces/token';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // Declaración de variables y URLS para petición
  private loginUrl = `${api}/api/login`
  private logoutUrl = `${api}/api/logout`
  private token: string|null = null;
  private static instance: LoginService

  // Inyección de HttpClient y generación de instancia
  constructor(private http: HttpClient) {
    LoginService.instance = this
  }

  // Metodo para obtener la instancia y usarla en distintos archivos
  public static getInstance(): LoginService { 
    return LoginService.instance
  }

  // Metodos para token
  setToken(token: string){
    this.token = token
  }
  getToken(){
    return this.token
  }
  /////////////////////

  logout(){
    return this.http.post(this.logoutUrl, {})
  }

  // Petición para API (Login)
  login(user: Login): Observable<Token>{
    return this.http.post<Token>(this.loginUrl, user)
  }
  /////////////////////
  VerificarAutenticacion(): Observable<any> {
    let url = `${api}/api/user`
    return this.http.get<any>(url)
  }
}
