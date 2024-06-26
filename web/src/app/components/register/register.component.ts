import { Component } from '@angular/core';
import { FormBuilder, FormControl,  ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { UserRegiser } from '../../interfaces/UserRegister';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, RouterModule, LoadingSpinnerComponent ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  constructor(private fb: FormBuilder, private rs: RegisterService, private router: Router){  }

  form = this.fb.group({
    'usuario': [{ value: '', disabled: false }, Validators.required],
    'email': [{ value: '', disabled: false }, [Validators.required, Validators.email]],
    'password': [{ value: '', disabled: false }, [Validators.required, Validators.minLength(8)]],
    'confirm_password': [{ value: '', disabled: false }, [Validators.required, Validators.minLength(8)]]
  })

  public msg: string|null = null;
  public emailError: Array<string>|null = null;
  public passwordError: Array<string>|null = null;
  public passwordConfirmationError: Array<string>|null = null;
  public nombreError: Array<string>|null = null;


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

  public loading: boolean = false;

  public userRegister: UserRegiser = {
    name: "",
    email: "",  
    password: "",
    password_confirmation: ""
  }

  disabledButton(): boolean {
    if(this.password.value != this.confirm_password.value){
      return true
    }
    return false
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
  

  submit(){
    this.loading = true
    this.form.disable()
    this.nombreError = null
    this.passwordError = null
    this.emailError = null
    
    this.userRegister.name = this.usuario.value
    this.userRegister.password = this.password.value
    this.userRegister.email = this.email.value
    this.userRegister.password_confirmation = this.confirm_password.value
    this.rs.registerUser(this.userRegister).subscribe(
      (response) => {
        this.msg = response.msg;
        setTimeout(() => {
          this.router.navigate([''])
        }, 2000)
      },
      (error) => {
        this.loading = false
        this.form.enable()


        if(error.error.error.email){
          this.emailError = []
          error.error.error.email.forEach((error: string) => {
            this.emailError?.push(error)
          }) 
        }
        if(error.error.error.password){
          this.passwordError = []
          error.error.error.password.forEach((error: string) => {
            this.passwordError?.push(error)
          }) 
        }
        if(error.error.error.name){
          this.nombreError = []
          error.error.error.name.forEach((error: string) => {
            this.nombreError?.push(error)
          }) 
        }
      }
    )
  }

}