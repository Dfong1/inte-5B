import { Component, NgModule } from '@angular/core';
import { FormControl,  FormGroup,  FormsModule,  ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { User } from '../../interfaces/User';
import { Login } from '../../interfaces/Login';
import { UserDataService } from '../../services/user-data.service';
import { Token } from '../../interfaces/token';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
}) 
export class LoginComponent {

  // Inyeccion de FormBuilder para formulario reactivo y LoginService para petición de Login
  constructor( private ls: LoginService, private ud: UserDataService, private router: Router) {}

  public loading: boolean = false;

  public form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  get email(){
    return this.form.get('email') as FormControl
  }
  get password() {
    return this.form.get('password') as FormControl
  }

  

    public message: string|null = null;
    public userLogin: Login = {
      email: "",
      password: ""
    }
    
    public token: Token = {
      token: "",
      msg: ""
    }

    public user: User = {
      id: 0,
      name: "",
      email: "",
      activate: 0,
      status: 0
    }

  onSubmit(event: Event){
    event.preventDefault()

    this.userLogin.email = this.email.value
    this.userLogin.password = this.password.value

    this.form.disable()

    this.loading = true
    this.message = null


    this.ls.login(this.userLogin).subscribe(
      (response) => {
        // Asignando datos al usuario
        localStorage.setItem('token', response.token)

        this.token.token = response.token

        this.ls.setToken(response.token)

        this.ud.getUser().subscribe(
          (response) => {
            this.ud.setUserData(response)
          }
        )

        this.router.navigate(['/home'])
      },
      (error) => {
        this.form.enable()
        this.loading = false
        this.message = error.error.msg
      }
    )

  }


}
