import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UserDataService } from '../../services/user-data.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/User';

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
  public userData: User = {
    id: 0,
    email: "",
    name: "",
    status: 0,
    activate: 0,
  }
  
  ngOnInit(): void {
    this.ud.getUser().subscribe(
      (response) => {
        this.userData = response

        console.log(this.userData)
      }
    )
  }

}
