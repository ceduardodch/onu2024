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
import { Grupo_sust } from './grupo-sust.model'; // Import the 'grupo_sust' class from the appropriate file
import { Grupo_sustService } from './grupo-sust.service';

@Component({
  selector: 'app-grupo_susts',
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
  templateUrl: './grupo-sust.component.html',
  styleUrls: ['./grupo-sust.component.scss']
})
export class Grupo_sustComponent implements OnInit{
        grupo_susts: Grupo_sust[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newGrupo_sust:Grupo_sust = {
          name: '', activo: ''};
        filteredGrupo_susts: Grupo_sust[] = [];
        searchTerm: string = '';
        selectedGrupo_sust:  Grupo_sust | null = null;
        orderAsc: boolean = true;
        currentField: string = '';

        constructor(private _grupo_sustService: Grupo_sustService) { }

            ngOnInit(): void {

            this.loadGrupo_susts();

            }

            addGrupo_sust(): void {
              this._grupo_sustService.addGrupo_sust(this.newGrupo_sust).subscribe({
                next: () => {
                  this.loadGrupo_susts();
                  this.newGrupo_sust = { name: '', activo: ''}; // Restablece el objeto `newGrupo_sust`
                },
                error: (error) => {
                  console.error('Error al agregar el país', error);
                }
              });
            }

              selectGrupo_sustForEdit(grupo_sust: Grupo_sust): void {
                this.selectedGrupo_sust = { ...grupo_sust };               
              }
            
              updateGrupo_sust(updatedGrupo_sust: Grupo_sust): void {
                
                if (!updatedGrupo_sust.id) {
                  console.error('Error al actualizar: ID de país no proporcionado');
                  return;
                }
                this._grupo_sustService.updateGrupo_sust(updatedGrupo_sust.id, updatedGrupo_sust).subscribe({
                  next: (response) => {
                    // Actualizar la lista de países en el frontend
                    const index = this.grupo_susts.findIndex(grupo_sust => grupo_sust.id === updatedGrupo_sust.id);
                    if (index !== -1) {
                      this.grupo_susts[index] = updatedGrupo_sust;
                    }
                    console.log('Grupo actualizado:', response);
                    this.selectedGrupo_sust = null; // Resetea la selección para cerrar el formulario de edición
                  },
                  error: (error) => {
                    console.error('Error al actualizar el país', error);
                  }
                });
              }

              deleteGrupo_sust(grupo_sustId: number): void {
                if (!grupo_sustId) {
                  console.error('Error al eliminar: ID de grupo no proporcionado');
                  return;
                }
              
                const confirmation = confirm('¿Estás seguro de que deseas eliminar este grupo?');
                if (!confirmation) {
                  return;
                }
              
                this._grupo_sustService.deleteGrupo_sust(grupo_sustId).subscribe({
                  next: () => {
                    // Eliminar el país de la lista en el frontend
                    this.loadGrupo_susts();
                    this.grupo_susts = this.grupo_susts.filter(grupo_sust => grupo_sust.id !== grupo_sustId);
                    console.log('Grupo eliminado con éxito');
                    this.selectedGrupo_sust = null; // Resetea la selección si se estaba editando el país eliminado
                  },
                  error: (error) => {
                    console.error('Error al eliminar el país', error);
                  }
                });
              }             

              loadGrupo_susts(): void {
                this._grupo_sustService.getGrupo_susts().subscribe({
                  next: (data) => {
                    this.grupo_susts = data;
                    this.filteredGrupo_susts = data;
                    this.applyFilter();
                  },
                  error: (error) => console.error(error)
                });
              }

              applyFilter(): void {
                this.filteredGrupo_susts = this.searchTerm
                  ? this.grupo_susts.filter(grupo_sust =>
                      grupo_sust.name.toLowerCase().includes(this.searchTerm.toLowerCase())  ||                   
                      grupo_sust.activo.toLowerCase().includes(this.searchTerm.toLowerCase())                     
                    )
                  : this.grupo_susts;
              }
            
              orderBy(field: string): void {
                // Si el campo actual es igual al nuevo, cambia la dirección, si no, establece la dirección a ascendente
                if (this.currentField === field) {
                  this.orderAsc = !this.orderAsc;
                } else {
                  this.orderAsc = true;
                  this.currentField = field;
                }
              
                this.filteredGrupo_susts.sort((a, b) => {
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
                this.selectedGrupo_sust = null;
                this.searchTerm = '';
                this.applyFilter();
              }

              
              
}