import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HistorialService } from '../../services/historial.service';
import { ActivatedRoute } from '@angular/router';
import Echo from 'laravel-echo'
import  Pusher  from 'pusher-js'
(window as any).Pusher = Pusher

@Component({
  selector: 'app-info-paquete',
  standalone: true,
  imports: [ NavbarComponent ],
  templateUrl: './info-paquete.component.html',
  styleUrl: './info-paquete.component.css'
})
export default class InfoPaqueteComponent implements OnInit, OnDestroy {

  constructor( private route: ActivatedRoute, private hs: HistorialService ) { }

  private echo: Echo = new Echo({
    broadcaster:'pusher',
    key:'123',
    cluster:'mt1',
    wsHost:'127.0.0.1',
    wsPort:6001,
    forceTLS:false,
    disableStatus:true,
  })

  ngOnInit(): void {
    const params = this.route.snapshot.params
    this.websocket()
      this.hs.getSensorData(params['id']).subscribe(
        (response) => {
        }
      )
  }

  websocket(){
    this.echo.channel('history').listen('HistoryEvent',(res:any)=>{
      console.log(res.data.data.valores)
    })
    console.log(this.echo)
  }

  ngOnDestroy(): void {
    this.echo.disconnect()
  }

}
