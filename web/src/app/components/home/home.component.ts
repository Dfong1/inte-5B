import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/User';
import { LoginService } from '../../services/login.service';
<<<<<<< HEAD
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
=======
import { Router, RouterModule } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';
import { NavbarComponent } from '../navbar/navbar.component';
>>>>>>> e47500688f98e9eeb139bb68c9acf1d679c0acb0

@Component({
  selector: 'app-home',
  standalone: true,
<<<<<<< HEAD
  imports: [FormsModule],
=======
  imports: [ RouterModule, NavbarComponent ],
>>>>>>> e47500688f98e9eeb139bb68c9acf1d679c0acb0
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


<<<<<<< HEAD
  constructor(private router: Router) { }
  public user: User = {
    data: {
      id: 0,
      name: "",
      email: "",
      rol_id: 0,
    },
    token: ""
  }
 
  ngOnInit(): void {
    
    console.log("Token", LoginService.getInstance().getToken())
    this.user.data.name = "Fong"

    // if(LoginService.getInstance().getToken() == null || LoginService.getInstance().getToken() != localStorage.getItem('token')){
    //   this.router.navigate([''])
    // }
    // else{
      
    // }  

=======
  constructor(private router: Router, private ud: UserDataService) { }
  // token = LoginService.getInstance().getToken()
  userData = this.ud.getUserData()

  
  ngOnInit(): void {
>>>>>>> e47500688f98e9eeb139bb68c9acf1d679c0acb0
  }

}
