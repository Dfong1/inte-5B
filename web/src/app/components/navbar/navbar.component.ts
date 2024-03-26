import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UserDataService } from '../../services/user-data.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

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
