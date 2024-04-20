import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import InfoPaqueteComponent from './components/info-paquete/info-paquete.component';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/login/login.component').then(l => l.LoginComponent) },
    { path: 'register', loadComponent: () => import('./components/register/register.component').then(r => r.RegisterComponent) },
    { path: 'home', loadComponent: () => import('./components/home/home.component').then(h => h.HomeComponent), canActivate: [authGuard]},
    { path: 'formulario-paquetes', loadComponent: () =>  import('./components/form-paquete/form-paquete.component').then(f => f.FormPaqueteComponent), canActivate: [authGuard]},
    { path: 'historial/:id', loadComponent: () =>  import('./components/historial/historial.component').then(h => h.HistorialComponent), canActivate: [authGuard]},
    { path: 'formulario-paquetes/:id', loadComponent: () =>  import('./components/form-paquete/form-paquete.component').then(f => f.FormPaqueteComponent), canActivate: [authGuard]},
    { path: 'info/:id', loadComponent: () =>  InfoPaqueteComponent, canActivate: [authGuard]},
];
