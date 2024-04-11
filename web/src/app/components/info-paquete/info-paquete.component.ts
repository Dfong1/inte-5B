import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HistorialService } from '../../services/historial.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Echo from 'laravel-echo'
import  Pusher  from 'pusher-js'
import { echo } from '../../interfaces/Environment';
import { ValoresPaquete } from '../../interfaces/valores-paquete';
import { CommonModule } from '@angular/common';
import { PaquetesService } from '../../services/paquetes.service';
import { Paquetes } from '../../interfaces/paquetes';
import { Subscription, interval, switchMap } from 'rxjs';
(window as any).Pusher = Pusher

@Component({
  selector: 'app-info-paquete',
  standalone: true,
  imports: [ NavbarComponent, CommonModule, RouterLink ],
  templateUrl: './info-paquete.component.html',
  styleUrl: './info-paquete.component.css'
})
export default class InfoPaqueteComponent implements OnInit, OnDestroy {

  constructor( private route: ActivatedRoute, private hs: HistorialService, private ps: PaquetesService, ) { }

  public valores: ValoresPaquete = {
    data: {
      data: {
        propiedades: [],
        valores: []
      },
      fecha: ""
    }
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
  private pollingSubscription: Subscription = new Subscription()

  ngOnInit(): void {
    const params = this.route.snapshot.params
    const pollingInterval = 2000

    this.pollingSubscription = interval(pollingInterval).pipe(
      switchMap(() => this.hs.getSensorData(params['id']))
      ).subscribe()
      this.websocket()
    
    this.valores = this.hs.getData()

    this.ps.getPaquete(params['id'][1]).subscribe(
      (response) => {
        console.log(response)
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

  websocket(){
    echo.channel('history').listen('HistoryEvent',(res:ValoresPaquete)=>{
      this.valores = res
      this.hs.setData(res)
    })
    console.log(echo)
    echo.connect()
  }

  ngOnDestroy(): void {
    echo.disconnect()
    this.pollingSubscription.unsubscribe()
  }

}
