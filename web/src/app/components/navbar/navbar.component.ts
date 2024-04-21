import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UserDataService } from '../../services/user-data.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/User';
import { CommonModule } from '@angular/common';
import { PaquetesService } from '../../services/paquetes.service';
import { Paquetes } from '../../interfaces/paquetes';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink, CommonModule, FormsModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private ud: UserDataService, private ps: PaquetesService, private ls: LoginService) { }
  token = LoginService.getInstance().getToken()
  public userData: User = {
    id: 0,
    email: "",
    name: "",
    status: 0,
    activate: 0,
  }
  public paquete: Paquetes = {
    id: 0,
    led: false,
    lugar: "",
    nombre: "",
    status: true,
    user_id: 0,
    esp_id: "",
    fecha_de_creacion: "",
  }

  public ruta: boolean = true
  
  ngOnInit(): void {
    const params = this.route.snapshot.params
    if(this.router.url == '/info/' + params['id'] || this.router.url == '/historial/' + params['id']){
      this.ruta = false
      this.ps.getPaquete(params['id'][1]).subscribe(
        (response) => {
          this.paquete.id = response.id
          this.paquete.led = response.led
          this.paquete.lugar = response.lugar
          this.paquete.nombre = response.nombre
          this.paquete.status = response.status
          this.paquete.user_id = response.user_id
          this.paquete.esp_id = response.esp_id
          this.paquete.fecha_de_creacion = response.fecha_de_creacion
        }
      )
    }
    else{
      this.ruta = true
    }
    this.ud.getUser().subscribe(
      (response) => {
        this.userData = response

      }
    )
  }

  encenderLed(id: Number){

    this.ps.turnOnLed(this.paquete.led, id).subscribe(
        (response) => {
        },
        (error) => {

        }
    );
}

cerrarSesion(){
  this.ls.logout().subscribe(
    (response) => {

      this.router.navigate([''])
    }
  )


}

}
