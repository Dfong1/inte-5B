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
import { Messages } from '../../interfaces/messages';

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
  public message: Messages = {
    errores: "",
    msg: ""
  }
  public paquetes: Paquetes[] = []
  public selectedPaquete: Paquetes = {
    id: 0,
    nombre: "",
    lugar: "",
    status: true,
    esp_id: "",
    user_id: 0,
    fecha_de_creacion: "",
    led: false
  }

  public check: boolean = false

  constructor( private ud: UserDataService, private ps: PaquetesService ) { }
  // token = LoginService.getInstance().getToken()
  
  encenderLed(paquete: Paquetes){
    this.ps.turnOnLed(paquete.id).subscribe(
        (response) => {
          
        },
        (error) => {

        }
    );
}
  ngOnInit(): void {
    this.ud.getUser().subscribe(
      (response) => {
        this.userData = response
      }
    )
    
    this.ps.getPaquetes().subscribe(
      (response) => {
        response.forEach((paquete, index) => {
          this.paquetes.push(paquete)
          if(paquete.led == false){
            this.paquetes[index].led = false
          }
          else {
            this.paquetes[index].led = true
          }
        })
      }
    )
  }

  deletePaquete(id: Number){
    this.ps.deletePaquete(id).subscribe(
      (response) => {
        this.message.msg = response.msg
      },
      (error) => {
        this.message.errores = error.errores
        this.message.msg = error.msg
      }
    )
  }

}
