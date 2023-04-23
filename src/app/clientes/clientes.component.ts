import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { OnInit } from '@angular/core';
import { ClienteService } from './cliente.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit{
  clientes: Cliente[];
  paginador: any;

  constructor(private clienteService: ClienteService, 
    private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page');
      if(!page) page = 0;

      this.clienteService.getClientes(page)
      .pipe(
        tap((response) => {
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          })
        })
      ).subscribe(response => {
        this.clientes = response.content as Cliente[];
        this.paginador = response;
      });
    })
  }

  delete(cliente: Cliente): void{
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que deseas eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe((response) => {
          this.clientes = this.clientes.filter(cli => cli !== cliente);
          Swal.fire(
            'Cliente eliminado!',
            `Cliente ${cliente.nombre} ${cliente.apellido} eliminado con éxito!`,
            'success'
          )
        });
      }
    })
  }
}
