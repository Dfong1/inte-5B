import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }
  private userData: User|null = null

  public getUserData(): User|null {
    return this.userData
  }

  public setUserData(userData: User|null) {
    this.userData = userData
  }

}
