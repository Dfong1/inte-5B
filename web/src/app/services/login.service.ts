import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/Login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // Declaración de variables y URLS para petición
  private loginUrl = 'http://127.0.0.1:8001/api/login/user'
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

  // Petición para API (Login)
  login(user: Login): Observable<User>{
    return this.http.post<User>(this.loginUrl, user)
  }
  /////////////////////
}
