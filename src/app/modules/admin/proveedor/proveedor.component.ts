import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Proveedor } from './proveedor.model'; // Import the 'User' class from the appropriate file
import { ProveedorService } from './proveedor.service';

@Component({
  selector: 'app-proveedors',
  standalone: true,
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule, 
    RouterLink, MatButtonModule, CdkScrollable,MatFormField
  ],
  animations: [
    trigger('fadeOutRight', [
      state('void', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition(':leave', [
        animate('0.5s ease-out')
      ])
    ])
  ],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.scss'
})
export class ProveedorsComponent implements OnInit{
        proveedors: Proveedor[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newProveedor:Proveedor = {
          name: '', country: '', activo: ''};
        filteredProveedors: Proveedor[] = [];
        searchTerm: string = '';
        selectedProveedor:  Proveedor | null = null;
        orderAsc: boolean = true;
        currentField: string = '';

        constructor(private _proveedorService: ProveedorService) { }

        ngOnInit(): void {

          this.loadProveedors();

            }

            addProveedor(): void {
              this._proveedorService.addProveedor(this.newProveedor).subscribe({
                next: () => {
                  this.loadProveedors();
                  this.newProveedor = { 
                    name: '', country: '',activo:''}; 
                    // Restablece el objeto `newProveedor`
                },
                error: (error) => {
                  console.error('Error al agregar la proveedor', error);
                }
              });
            }

              selectProveedorForEdit(proveedor: Proveedor): void {
                this.selectedProveedor = { ...proveedor };               
              }
            
              updateProveedor(updatedProveedor: Proveedor): void {
                
                if (!updatedProveedor.id) {
                  console.error('Error al actualizar: ID de proveedor no proporcionado');
                  return;
                }
                this._proveedorService.updateProveedor(updatedProveedor.id, updatedProveedor).subscribe({
                  next: (response) => {
                    // Actualizar la lista de proveedors en el frontend
                    const index = this.proveedors.findIndex(proveedor => proveedor.id === updatedProveedor.id);
                    if (index !== -1) {
                      this.proveedors[index] = updatedProveedor;
                    }
                    console.log('Proveedor actualizado:', response);
                    this.selectedProveedor = null; // Resetea la selección para cerrar el formulario de edición
                  },
                  error: (error) => {
                    console.error('Error al actualizar el proveedor', error);
                  }
                });
              }

              deleteProveedor(proveedorId: number): void {
                if (!proveedorId) {
                  console.error('Error al eliminar: ID de proveedor no proporcionado');
                  return;
                }
              
                const confirmation = confirm('¿Estás seguro de que deseas eliminar este proveedor?');
                if (!confirmation) {
                  return;
                }
              
                this._proveedorService.deleteProveedor(proveedorId).subscribe({
                  next: () => {
                    // Eliminar el proveedor de la lista en el frontend
                    this.loadProveedors();
                    this.proveedors = this.proveedors.filter(proveedor => proveedor.id !== proveedorId);
                    console.log('Proveedor eliminado con éxito');
                    this.selectedProveedor = null; // Resetea la selección si se estaba editando el país eliminado
                  },
                  error: (error) => {
                    console.error('Error al eliminar el proveedor', error);
                  }
                });
              }             

              loadProveedors(): void {
                this._proveedorService.getProveedors().subscribe({
                  next: (data) => {
                    this.proveedors = data;
                    this.filteredProveedors = data;
                    this.applyFilter();
                  },
                  error: (error) => console.error(error)
                });
              }

              applyFilter(): void {
                this.filteredProveedors = this.searchTerm
                  ? this.proveedors.filter(proveedor =>
                      proveedor.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                      proveedor.country.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                      proveedor.activo.toLowerCase().includes(this.searchTerm.toLowerCase())
                    )
                  : this.proveedors;
              }
            
              orderBy(field: string): void {
                // Si el campo actual es igual al nuevo, cambia la dirección, si no, establece la dirección a ascendente
                if (this.currentField === field) {
                  this.orderAsc = !this.orderAsc;
                } else {
                  this.orderAsc = true;
                  this.currentField = field;
                }
              
                this.filteredProveedors.sort((a, b) => {
                  const valueA = a[field].toLowerCase();
                  const valueB = b[field].toLowerCase();
              
                  // Comparar los valores para el ordenamiento
                  if (valueA < valueB) {
                    return this.orderAsc ? -1 : 1;
                  }
                  if (valueA > valueB) {
                    return this.orderAsc ? 1 : -1;
                  }
                  return 0;
                });
              }
            
              cancelEdit(): void {
                this.selectedProveedor = null;
                this.searchTerm = '';
                this.applyFilter();
              }
}