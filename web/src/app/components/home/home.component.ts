import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/User';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


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

  }

}
