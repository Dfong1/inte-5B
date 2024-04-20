import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HistorialService } from '../../services/historial.service';
import { Historial } from '../../interfaces/historial';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [ NavbarComponent, CommonModule, FormsModule,  ],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {

  constructor( private hs: HistorialService, private route: ActivatedRoute ) {}

  public data: Historial = {
    data: 
    [
      {
      }
    ]
  }

  public params = this.route.snapshot.params

  ngOnInit(): void {
    
    this.hs.getHistorial(this.params['id']).subscribe(
      (response) => {
        console.log(response)

        console.log(response.data.length)
        response.data.forEach((data: any) => {
          data._id = null
        })
        this.data = response
      }
    )

  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
