import { Injectable } from '@angular/core';
import { api } from '../interfaces/Environment';
import { UserRegiser } from '../interfaces/UserRegister';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private registerURL = `${api}/api/register`
  constructor( private http: HttpClient ) { }

  registerUser(user: UserRegiser): Observable<Post> {
    return this.http.post<Post>(this.registerURL, user)
  }
}
