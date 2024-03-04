import { HttpInterceptorFn } from '@angular/common/http';
import { LoginService } from '../services/login.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Extracción de token
  let token: string|null = LoginService.getInstance().getToken()
  
  // Generación de cabezaras para accesos
  let headers = req.headers
  if(token){
    headers = headers.set('Authorization','Bearer ' + token);
    LoginService.getInstance().setToken(token);
  }
  headers = headers.set('Accept', 'application/json');
  
  req = req.clone({headers: headers})

  return next(req);
};
