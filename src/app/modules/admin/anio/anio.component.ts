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
import { Anio } from './anio.model'; // Import the 'anio' class from the appropriate file
import { AnioService } from './anio.service';

@Component({
  selector: 'app-anioes',
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
  templateUrl: './anio.component.html',
  styleUrls: ['./anio.component.scss']
})
export class AniosComponent implements OnInit{
        anios: Anio[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newAnio:Anio = {
          name: '', activo: ''};
        filteredAnios: Anio[] = [];
        searchTerm: string = '';
        selectedAnio:  Anio | null = null;
        orderAsc: boolean = true;
        currentField: string = '';

        constructor(private _anioService: AnioService) { }

            ngOnInit(): void {

            this.loadAnios();

            }

            addAnio(): void {
              this._anioService.addAnio(this.newAnio).subscribe({
                next: () => {
                  this.loadAnios();
                  this.newAnio = { name: '', activo: ''}; // Restablece el objeto `newAnio`
                },
                error: (error) => {
                  console.error('Error al agregar el país', error);
                }
              });
            }

              selectAnioForEdit(anio: Anio): void {
                this.selectedAnio = { ...anio };               
              }
            
              updateAnio(updatedAnio: Anio): void {
                
                if (!updatedAnio.id) {
                  console.error('Error al actualizar: ID de año no proporcionado');
                  return;
                }
                this._anioService.updateAnio(updatedAnio.id, updatedAnio).subscribe({
                  next: (response) => {
                    // Actualizar la lista de países en el frontend
                    const index = this.anios.findIndex(anio => anio.id === updatedAnio.id);
                    if (index !== -1) {
                      this.anios[index] = updatedAnio;
                    }
                    console.log('Año actualizado:', response);
                    this.selectedAnio = null; // Resetea la selección para cerrar el formulario de edición
                  },
                  error: (error) => {
                    console.error('Error al actualizar el año', error);
                  }
                });
              }

              deleteAnio(anioId: number): void {
                if (!anioId) {
                  console.error('Error al eliminar: ID de año no proporcionado');
                  return;
                }
              
                const confirmation = confirm('¿Estás seguro de que deseas eliminar este año?');
                if (!confirmation) {
                  return;
                }
              
                this._anioService.deleteAnio(anioId).subscribe({
                  next: () => {
                    // Eliminar el país de la lista en el frontend
                    this.loadAnios();
                    this.anios = this.anios.filter(anio => anio.id !== anioId);
                    console.log('Año eliminado con éxito');
                    this.selectedAnio = null; // Resetea la selección si se estaba editando el país eliminado
                  },
                  error: (error) => {
                    console.error('Error al eliminar el año', error);
                  }
                });
              }             

              loadAnios(): void {
                this._anioService.getAnios().subscribe({
                  next: (data) => {
                    this.anios = data;
                    this.filteredAnios = data;
                    this.applyFilter();
                  },
                  error: (error) => console.error(error)
                });
              }

              applyFilter(): void {
                this.filteredAnios = this.searchTerm
                  ? this.anios.filter(anio =>
                      anio.name.toLowerCase().includes(this.searchTerm.toLowerCase())  ||                   
                      anio.activo.toLowerCase().includes(this.searchTerm.toLowerCase())                     
                    )
                  : this.anios;
              }
            
              orderBy(field: string): void {
                // Si el campo actual es igual al nuevo, cambia la dirección, si no, establece la dirección a ascendente
                if (this.currentField === field) {
                  this.orderAsc = !this.orderAsc;
                } else {
                  this.orderAsc = true;
                  this.currentField = field;
                }
              
                this.filteredAnios.sort((a, b) => {
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
                this.selectedAnio = null;
                this.searchTerm = '';
                this.applyFilter();
              }

              
              
}