import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';
import { api } from '../interfaces/Environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private meURL = `${api}/api/user/me`

  constructor(private http: HttpClient) { }
  private userData: User = {
    id: 0,
    name: "",
    email: "",
    activate: 0,
    status: 0
  }

  public getUserData(): User {
    return this.userData
  }

  public setUserData(userData: User) {
    this.userData = userData
  }
  public getUser(): Observable<User> {
    return this.http.get<User>(this.meURL)
  } 

}
