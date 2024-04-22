import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HistorialService } from '../../services/historial.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {ChartDataset, ChartOptions, Chart, LinearScale,BarController,CategoryScale,BarElement} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'
Chart.register(LinearScale,BarController,CategoryScale,BarElement,ChartDataLabels);
import  Pusher  from 'pusher-js'
import { ValoresPaquete } from '../../interfaces/valores-paquete';
import { CommonModule } from '@angular/common';
import { PaquetesService } from '../../services/paquetes.service';
import { Paquetes } from '../../interfaces/paquetes';
import { Subscription, interval, switchMap } from 'rxjs';
import {Estadisitca} from "../../interfaces/estadisitca";
import Echo from 'laravel-echo';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
(window as any).Pusher = Pusher

export interface ChartData {
  _id: string;
  promedio: number;
}
@Component({
  selector: 'app-info-paquete',
  standalone: true,
  imports: [ NavbarComponent, CommonModule, RouterLink, LoadingSpinnerComponent ],
  templateUrl: './info-paquete.component.html',
  styleUrl: './info-paquete.component.css'
})
export default class InfoPaqueteComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas:any;
  private chart?: Chart;


  constructor( private route: ActivatedRoute, private hs: HistorialService, private ps: PaquetesService, ) { }

  public loading: boolean = true;

  public valores: ValoresPaquete = {
    data: {
      data: {
        propiedades: [],
        valores: []
      },
      fecha: ""
    }
  }
  public seleccionado: ValoresPaquete = {
    data: {
      data: {
        propiedades: [],
        valores: []
      },
      fecha: ""
    }
  }

  public isData: boolean = false

  public estadistica: Estadisitca = {
    data: [{
        _id: "",
        promedio: 0
      }]
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
  public promedio: any = [];
  public labelList:any = [];
  public sensorName: string = ""
  private pollingSubscription: Subscription = new Subscription()
  public errorMessage: string|null = null;
  public echo: Echo = new Echo({
    broadcaster:'pusher',
    key:'123',
    cluster:'mt1',
    wsHost:'127.0.0.1',
    wsPort:6001,
    forceTLS:false,
    disableStatus:true,
  })

  websocket(){
    this.echo.channel('history').listen('HistoryEvent',(res:ValoresPaquete)=>{
      this.valores = res
    })

    this.echo.connect()
  }

  public params = this.route.snapshot.params


  ngOnInit(): void {
    this.websocket()

    this.ps.getPaquete(this.params['id']).subscribe(
      (response) => {

        this.paquete.id = response.id
        this.paquete.led = response.led
        this.paquete.lugar = response.lugar
        this.paquete.nombre = response.nombre
        this.paquete.status = response.status
        this.paquete.user_id = response.user_id
        this.paquete.esp_id = response.esp_id
        this.paquete.fecha_de_creacion = response.fecha_de_creacion

      }, (error) => {
      }
    )
    const pollingInterval = 5000
    this.isData = true
    this.pollingSubscription = interval(pollingInterval).pipe(
      switchMap(() => this.hs.getSensorData(this.params['id']))
      ).subscribe(
        (response) => {
        this.loading = false
        this.isData = false
        },
        (error) => {
          this.isData = true
          this.errorMessage = error.error.message
          this.loading = false
        }
      )    

  }

    openModal(sensor: string, paquete_id: string, ) {
      String(paquete_id)
    if (this.chart && this.labelList.length > 0 && this.promedio.length > 0) {
      this.chart.destroy();
      this.labelList = []
      this.promedio = []
    }

    this.hs.getAvarage(sensor, paquete_id).subscribe(
      (response) => {

        console.log(response)

        this.estadistica.data = response.data;
        for (let item of this.estadistica.data) {
          this.labelList.push(item._id);
          this.promedio.push(item.promedio);
        }

        const data: ChartDataset = {
          label: 'Volumen de tráfico',
          data: this.promedio,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        };

        const options: ChartOptions = {
          indexAxis: 'y',
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            datalabels: {
              align: 'center',
              anchor: 'center',
              color: '#000',

              font: {
                size: 15,
              }
            }
          },
        };

        this.chart = new Chart(this.chartCanvas.nativeElement, {
          type: 'bar',
          data: {
            labels: this.labelList,
            datasets: [data],
          },
          options: options,
        });
      }
    )

    const iniciales = sensor.length == 5 ? sensor[0] + sensor[1] +  sensor[2] : sensor[0] + sensor[1] 
    const numeros = sensor.length == 5 ? sensor[3] +  sensor[4] : sensor[2] + sensor[3] 

      if(iniciales == "PSN"){
        sensor = "presion" + " " + numeros 
      }
      else if(iniciales == "TEM"){
        sensor = "temperatura" + " " + numeros
      }
      else if(iniciales == "CON"){
        sensor = "conductividad" + " " + numeros
      }
      else if(iniciales == "TUR"){
        sensor = "turbidez" + " " + numeros
      }
      else if(iniciales == "NV"){
        sensor = "nivel de agua" + " " + numeros
      }
      else if(iniciales == "PH"){
        sensor = "presion" + " " + numeros
      }

    this.sensorName = sensor

  }

  ngOnDestroy(): void {
    this.echo.disconnect()
    this.pollingSubscription.unsubscribe()
  }


}
