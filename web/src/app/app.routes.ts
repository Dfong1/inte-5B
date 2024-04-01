import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { FormPaqueteComponent } from './components/form-paquete/form-paquete.component';
import { InfoPaqueteComponent } from './components/info-paquete/info-paquete.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard]},
    { path: 'formulario-paquetes', component: FormPaqueteComponent},
    { path: 'info', component: InfoPaqueteComponent}
];
