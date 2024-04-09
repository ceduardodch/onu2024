import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { Proveedor } from './proveedor.model'; // Import the 'User' class from the appropriate file
import { ProveedorService } from './proveedor.service';

import { PaisService } from '../pais/pais.service';

@Component({
  selector: 'app-proveedors',
  standalone: true,
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule,MatAutocompleteModule,
    RouterLink, MatButtonModule, CdkScrollable,MatFormField, ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,MatSelectModule,MatSlideToggleModule,
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
          name: '', country: '', activo: false};
        filteredProveedors: Proveedor[] = [];
        searchTerm: string = '';
        selectedProveedor:  Proveedor | null = null;
        orderAsc: boolean = true;
        currentField: string = '';
        countrys: any[];
        importadorControl = new FormControl();

        constructor(
          private _proveedorService: ProveedorService,
          private _paisService: PaisService
        ) { }

        ngOnInit(): void {

          this.loadProveedors();

          this._paisService.getPaises().subscribe((data: any[]) => {
            this.countrys = data;
          });

            }

            onPaisSelected(event: MatAutocompleteSelectedEvent) {
              if (event?.option?.value) {
                this.newProveedor.country = event.option.value;
              } else {
                // Manejo de error: se seleccionó una opción no válida o el evento está indefinido.
                console.error('El evento o la opción seleccionada son indefinidos');
              }
            }

            // Esta función se activa cuando se cambia el estado del checkbox de 'activo'
            onActivoChange(event: MatSlideToggleChange, proveedor: Proveedor): void {
              proveedor.activo = event.checked;
            }

            addProveedor(): void {
              this._proveedorService.addProveedor(this.newProveedor).subscribe({
                next: () => {
                  this.loadProveedors();
                  this.newProveedor = { 
                    name: '', country: '',activo: false}; 
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
                      proveedor.country.toLowerCase().includes(this.searchTerm.toLowerCase())                       
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
                  const valueA = a[field] ? a[field].toString().toLowerCase() : '';
                  const valueB = b[field] ? b[field].toString().toLowerCase() : '';
              
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