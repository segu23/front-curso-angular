import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})

export class FormComponent {

  public titulo: string = "Crear Cliente";
  public cliente: Cliente = new Cliente();

  public errors: string[];

  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente
        })
      }
    })
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe((cliente) => {
      this.router.navigate(['/clientes'])
      Swal.fire('Nuevo cliente', `¡El cliente ${cliente.nombre + " " + cliente.apellido} ha sido creado con éxito!`, 'success');
    }, (err) => {
      this.errors = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status);
      console.error('err.error.errors');
    });
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe((response) => {
      this.router.navigate(['/clientes'])
      Swal.fire('Cliente actualizado', `${response.mensaje + ": " + response.cliente.nombre + " " + response.cliente.apellido}`, 'success');
    }, (err) => {
      this.errors = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status);
      console.error('err.error.errors');
    });
  }
}
