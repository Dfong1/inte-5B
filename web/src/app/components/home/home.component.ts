import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/User';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


  constructor(private router: Router) { }

  
  ngOnInit(): void {
    let token: string|null = LoginService.getInstance().getToken()
    
    console.log("Token", token)

    // if(this.token == null || this.token != localStorage.getItem('token')){
    //   this.router.navigate([''])
    // }

  }

}
