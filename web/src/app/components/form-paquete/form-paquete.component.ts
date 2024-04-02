import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { PaquetesService } from '../../services/paquetes.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreatePaquete } from '../../interfaces/create-paquete';

@Component({
  selector: 'app-form-paquete',
  standalone: true,
  imports: [ NavbarComponent, ReactiveFormsModule, CommonModule ],
  templateUrl: './form-paquete.component.html',
  styleUrl: './form-paquete.component.css'
})
export default class FormPaqueteComponent implements OnInit {


  constructor( private router: Router, private route: ActivatedRoute, private ps: PaquetesService, private fb: FormBuilder) { }

  form = this.fb.group({
    'nombre': ['', [Validators.required, Validators.maxLength(20),]],
    'lugar': ['', [Validators.required, Validators.maxLength(20)]]
  })
  public successMessage: string|null = null

  get nombre(){
    return this.form.get('nombre') as FormControl
  }
  get lugar() {
    return this.form.get('lugar') as FormControl
  }
  crear: boolean = false
  editar: boolean = false

  public paquete: CreatePaquete = {
    lugar: "",
    nombre: ""
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params
    if(params['id']){
      this.crear = false
      this.editar = true



    }
    else {
      this.editar = false
      this.crear = true
    }
  }

  onSubmit(){
    this.paquete.lugar = this.lugar.value
    this.paquete.nombre = this.nombre.value
    this.ps.createPaquete(this.paquete).subscribe(
      (response) => {
        this.successMessage = "Paquete creado con exito"
        
        setTimeout(() => {
          this.router.navigate(['/home'])
        }, 2000)
      }
    )
  }

}
