import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/User';
import { LoginService } from '../../services/login.service';
import { Router, RouterModule } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterModule, NavbarComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


  constructor(private router: Router, private ud: UserDataService) { }
  // token = LoginService.getInstance().getToken()
  userData = this.ud.getUserData()

  
  ngOnInit(): void {
  }

}
