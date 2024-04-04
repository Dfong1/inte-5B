import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UserDataService } from '../../services/user-data.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/User';
import { CommonModule } from '@angular/common';
import { PaquetesService } from '../../services/paquetes.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private ud: UserDataService, private ps: PaquetesService) { }
  token = LoginService.getInstance().getToken()
  public userData: User = {
    id: 0,
    email: "",
    name: "",
    status: 0,
    activate: 0,
  }

  public ruta: boolean = true
  
  ngOnInit(): void {
    const params = this.route.snapshot.params
    if(this.router.url == '/info/' + params['id']){
      // console.log("INFO")
      this.ruta = false
    }
    else{
      this.ruta = true
    }
    this.ud.getUser().subscribe(
      (response) => {
        this.userData = response

        console.log(this.userData)
      }
    )
  }

  encenderLed(id: Number){
    this.ps.turnOnLed(id).subscribe(
        (response) => {
          
        },
        (error) => {

        }
    );
}

}
