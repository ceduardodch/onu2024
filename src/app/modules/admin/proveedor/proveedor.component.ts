import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Proveedor } from './proveedor.model'; // Import the 'User' class from the appropriate file
import { ProveedorService } from './proveedor.service';


@Component({
  selector: 'app-proveedors',
  standalone: true,
  imports        : [NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe,FormsModule],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.scss'
})
export class ProveedorsComponent implements OnInit{
        proveedors: Proveedor[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newProveedor:Proveedor = {
          id:0, name: '', country: '',activo:'', created_at: '',updated_at: ''};


        constructor(private _proveedorService: ProveedorService) { }

        ngOnInit(): void {

            this._proveedorService.getProveedors().subscribe((proveedors: Proveedor[]) => {
                this.proveedors = (proveedors);
            });
            }

            addProveedor(): void {
                console.log();
                this._proveedorService.addProveedor(this.newProveedor).subscribe((proveedor: Proveedor) => {
                  this.proveedors.push(proveedor);
                });
              }
  editProveedor(proveedor) {
    // Aquí va tu código para editar el usuario
  }
}

function subscribe(arg0: (proveedor: Proveedor) => void) {
    throw new Error('Function not implemented.');
}

