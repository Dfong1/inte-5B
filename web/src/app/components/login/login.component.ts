import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormControl,  FormsModule,  ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { User } from '../../interfaces/User';
import { Login } from '../../interfaces/Login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  // Inyeccion de FormBuilder para formulario reactivo y LoginService para petición de Login
  constructor(private fb: FormBuilder, private ls: LoginService, private router: Router) {}

    public message: string|null = null;
    public userLogin: Login = {
      email: "",
      password: ""
    }
    public user: User = {
      data: {
        id: 0,
        name: "",
        email: "",
        rol_id: 0,
      },
      token: "",
    }

  onSubmit(event: Event){
    event.preventDefault()
    
    this.ls.login(this.userLogin).subscribe(
      (response) => {
        // Asignando datos al User
        console.log("Response", response.data);
        localStorage.setItem('token', response.token)
        this.user.data.id = response.data.id
        this.user.data.name = response.data.name
        this.user.data.rol_id = 1
        this.user.token = response.token

        this.router.navigate(['/home'])
      },
      (error) => {
        // Muestra mensaje de error en caso de que el usuario haya introducido correo o contraseña incorrectos
        this.message = error.msg
      }
    )
    
  }


}
