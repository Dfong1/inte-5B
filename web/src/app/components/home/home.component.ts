import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/User';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { PaquetesService } from '../../services/paquetes.service';
import { Paquetes } from '../../interfaces/paquetes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterModule, NavbarComponent, FormsModule, CommonModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent implements OnInit {


  public userData: User = {
    id: 0,
    name: "",
    email: "",
    activate: 0,
    status: 0
  }
  public paquetes: Paquetes[] = []

  constructor( private ud: UserDataService, private ps: PaquetesService ) { }
  // token = LoginService.getInstance().getToken()
  
  ngOnInit(): void {
    this.ud.getUser().subscribe(
      (response) => {
        this.userData = response

        console.log(this.userData)
      }
    )
    
    this.ps.getPaquetes().subscribe(
      (response) => {
        console.log(response)
        response.forEach((paquete) => {
          this.paquetes.push(paquete)
        })
      }
    )
  }

}
