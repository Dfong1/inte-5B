import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { PaquetesService } from '../../services/paquetes.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreatePaquete } from '../../interfaces/create-paquete';
import { Messages } from '../../interfaces/messages';

@Component({
  selector: 'app-form-paquete',
  standalone: true,
  imports: [ NavbarComponent, ReactiveFormsModule, CommonModule, RouterLink, FormsModule ],
  templateUrl: './form-paquete.component.html',
  styleUrl: './form-paquete.component.css'
})
export class FormPaqueteComponent implements OnInit {


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
  public message: Messages = {
    errores: "",
    msg: "",
  }

  public errorNombre: Array<string> | null = null
  public errorLugar: Array<string> | null = null

  ngOnInit(): void {
    const params = this.route.snapshot.params
    if(params['id']){
      this.crear = false
      this.editar = true
      this.ps.getPaquete(params['id']).subscribe(
        (response) => {
          this.nombre.setValue(response.nombre)
          this.lugar.setValue(response.lugar)
          this.paquete.lugar = response.lugar
          this.paquete.nombre = response.nombre
        }
      )
    }
    else {
      this.editar = false
      this.crear = true
    }
  }

  onSubmit(){
    const params = this.route.snapshot.params
    this.paquete.lugar = this.lugar.value
    this.paquete.nombre = this.nombre.value
    if(params['id']){
      this.ps.editPaquete(this.paquete, params['id']).subscribe(
        (response) => {
          this.message.msg = response.msg
          
          setTimeout(() => {
            this.router.navigate(['/home'])
          }, 2000)
        },
        (error) => {
          
          if(error.error.errores.nombre){
            error.error.errores.nombre.forEach((error: string) => {
              this.errorNombre?.push(error)
            })
          }
          if(error.error.errores.lugar){
            error.error.errores.lugar.forEach((error: string) => {
              this.errorLugar?.push(error)
            })
          }

          this.message.msg = error.error.msg
        }
      )
    }
    else {
      this.ps.createPaquete(this.paquete).subscribe(
        (response) => {
          this.successMessage = "Paquete creado con exito"
          
          setTimeout(() => {
            this.router.navigate(['/home'])
          }, 2000)
        }, (error) => {
          if(error.error.errores.nombre){
            error.error.errores.nombre.forEach((error: string) => {
              this.errorNombre?.push(error)
            })
          }
          if(error.error.errores.lugar){
            error.error.errores.lugar.forEach((error: string) => {
              this.errorLugar?.push(error)
            })
          }

        }
      )
    }
  }

}
