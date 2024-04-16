import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate {

  constructor(private router: Router, private ls: LoginService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    try {
      const isAuth = await this.ls.VerificarAutenticacion().toPromise()
      return isAuth
    } catch (error) {
      return this.router.createUrlTree([''])
    }
  }
};
