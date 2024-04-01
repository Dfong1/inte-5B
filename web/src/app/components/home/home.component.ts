import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/User';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterModule, NavbarComponent, FormsModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


  public userData: User = {
    id: 0,
    name: "",
    email: "",
    activate: 0,
    status: 0
  }

  constructor(private router: Router, private ud: UserDataService) { }
  // token = LoginService.getInstance().getToken()
  
  ngOnInit(): void {
    this.ud.getUser().subscribe(
      (response) => {
        this.userData = response

        console.log(this.userData)
      }
    )
  }

}
