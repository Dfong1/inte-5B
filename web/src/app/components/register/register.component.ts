import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormControl,  ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

  NgModule({
    declarations: [
      HttpClient
    ],
    imports: [
      HttpClient
    ]
  })
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private fb: FormBuilder){  }

  form = this.fb.group({
    'usuario': ['', Validators.required],
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', Validators.required],
    'confirm_password': ['', Validators.required]
  })


  get usuario() {
    return this.form.get('usuario') as FormControl
  }
  get email(){
    return this.form.get('email') as FormControl
  }
  get password() {
    return this.form.get('password') as FormControl
  }
  get confirm_password() {
    return this.form.get('confirm_password') as FormControl
  }

  isInvalid: string = '';
  mostrarAlert:boolean = false;

  getErrorMessage() {
    if (this.email.errors?.['required']) {
      this.isInvalid = 'is-invalid'
      return 'Debes ingresar un correo';
    }
    if(this.email.errors?.['email']){
      this.isInvalid = 'is-invalid'
      return "El formato de correo es incorrecto"
    }
    return this.isInvalid = ''
  }
  
  mostrar_datos(correo: string, contrasena: string){
    console.log("Correo", correo);
    console.log("Contraseña", contrasena);
    
    this.mostrarAlert = true
  }



}
