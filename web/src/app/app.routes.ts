import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { KitsComponent } from './components/kits/kits.component';
import { FormPaqueteComponent } from './components/form-paquete/form-paquete.component';
import { InfoPaqueteComponent } from './components/info-paquete/info-paquete.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent},
    { path: 'formulario-paquetes', component: FormPaqueteComponent},
    { path: 'info', component: InfoPaqueteComponent}
];
    NgModule({
        declarations: [
            AppComponent,
            LoginComponent,
            RegisterComponent,
            HomeComponent,
        ],
        imports: [
            BrowserModule,
            RouterModule.forRoot(routes)
        ],
        providers: [],
        bootstrap: [AppComponent]
    })
    
