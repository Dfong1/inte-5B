import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HistorialService } from '../../services/historial.service';
import { Historial } from '../../interfaces/historial';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginatedData } from '../../interfaces/paginated-data';
import { api } from '../../interfaces/Environment';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';


@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [ NavbarComponent, CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {

  constructor( private hs: HistorialService, private route: ActivatedRoute ) {}
 
  public paginaActual: Number = 1

  public loading: boolean = true

  public data: PaginatedData | null = null

  public params = this.route.snapshot.params

  pageUrl: string = `${api}/api/historial/${this.params['id']}?page=${this.paginaActual}`

  ngOnInit(): void {
    
    this.hs.getHistorial(this.pageUrl).subscribe(
      (response) => {
        this.data = response
        this.loading = false
      },
      (error) => {
        this.loading = false
      }
    )

  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  onPageChange(paginationUrl: string): void{

    this.hs.getHistorial(paginationUrl).subscribe(
      (response) => {
        this.data = response
      }
    )

  }


  translatePaginationLabel(label: string): string {
    switch (label) {
      case '&laquo; Previous':
        return 'Anterior';
      case 'Next &raquo;':
        return 'Siguiente';
      default:
        return label;
    }
  }

}
