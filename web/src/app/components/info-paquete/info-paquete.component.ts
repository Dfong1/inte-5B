import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HistorialService } from '../../services/historial.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info-paquete',
  standalone: true,
  imports: [ NavbarComponent ],
  templateUrl: './info-paquete.component.html',
  styleUrl: './info-paquete.component.css'
})
export default class InfoPaqueteComponent implements OnInit {

  constructor( private route: ActivatedRoute, private hs: HistorialService ) { }

  ngOnInit(): void {
    const params = this.route.snapshot.params

      this.hs.getSensorData(params['id']).subscribe(
        (response) => {
          console.log(response)
        }
      )
  }

}
