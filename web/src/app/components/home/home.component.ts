import { Component, OnInit, booleanAttribute } from '@angular/core';
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
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterModule, NavbarComponent, FormsModule, CommonModule, LoadingSpinnerComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public loading: boolean =true

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
  
  private mandarLed: Number = 0

  encenderLed(paquete: Paquetes){

    this.ps.turnOnLed(paquete.led, paquete.id).subscribe(
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
          this.paquetes?.push(paquete)
          if(paquete.led == false){
            this.paquetes[index].led = false
          }
          else {
            this.paquetes[index].led = true
          }
          this.check = paquete.led
        })
        
        this.loading = false
      }, (error) => {
        this.loading = false
      }
    )
  }

  deletePaquete(id: Number){
    this.ps.deletePaquete(id).subscribe(
      (response) => {
        this.message.msg = response.msg
        
        this.ps.getPaquetes().subscribe(
          (response) => {
            this.paquetes = []
            response.forEach((paquete, index) => {
              this.paquetes.push(paquete)
              if(paquete.led == false){
                this.paquetes[index].led = false
              }
              else {
                this.paquetes[index].led = true
              }
              this.check = paquete.led
            })
          }
        )

      },
      (error) => {
        this.message.errores = error.errores
        this.message.msg = error.msg
      }
    )
  }

}
