import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/User';
import { LoginService } from '../../services/login.service';
import { Router, RouterModule } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


  constructor(private router: Router, private ud: UserDataService) { }
  token = LoginService.getInstance().getToken()
  userData = this.ud.getUserData()

  
  ngOnInit(): void {
    
    console.log("Token", LoginService.getInstance().getToken())
    console.log("userData", this.userData)

    if(this.token == null || this.token != localStorage.getItem('token')){
      this.router.navigate([''])
    }

  }

}
