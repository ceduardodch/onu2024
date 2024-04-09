import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { Gruposust } from './gruposust.model'; // Import the 'gruposust' class from the appropriate file
import { GruposustService } from './gruposust.service';

@Component({
  selector: 'app-gruposusts',
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
  templateUrl: './gruposust.component.html',
  styleUrls: ['./gruposust.component.scss']
})
export class GruposustComponent implements OnInit{
        gruposusts: Gruposust[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newGruposust:Gruposust = {
          name: '', activo: false};
        filteredGruposusts: Gruposust[] = [];
        searchTerm: string = '';
        selectedGruposust:  Gruposust | null = null;
        orderAsc: boolean = true;
        currentField: string = '';

        constructor(private _gruposustService: GruposustService) { }

            ngOnInit(): void {

            this.loadGruposusts();

            }

            onActivoChange(event: MatSlideToggleChange, gruposust: Gruposust): void {
              gruposust.activo = event.checked;
            }
            

            addGruposust(): void {
              this._gruposustService.addGruposust(this.newGruposust).subscribe({
                next: () => {
                  this.loadGruposusts();
                  this.newGruposust = { name: '', activo: false}; // Restablece el objeto `newGruposust`
                },
                error: (error) => {
                  console.error('Error al agregar el grupo', error);
                }
              });
            }

              selectGruposustForEdit(gruposust: Gruposust): void {
                this.selectedGruposust = { ...gruposust };               
              }
            
              updateGruposust(updatedGruposust: Gruposust): void {
                
                if (!updatedGruposust.id) {
                  console.error('Error al actualizar: ID de grupo no proporcionado');
                  return;
                }
                this._gruposustService.updateGruposust(updatedGruposust.id, updatedGruposust).subscribe({
                  next: (response) => {
                    // Actualizar la lista de grupo en el frontend
                    const index = this.gruposusts.findIndex(gruposust => gruposust.id === updatedGruposust.id);
                    if (index !== -1) {
                      this.gruposusts[index] = updatedGruposust;
                    }
                    console.log('Grupo actualizado:', response);
                    this.selectedGruposust = null; // Resetea la selección para cerrar el formulario de edición
                  },
                  error: (error) => {
                    console.error('Error al actualizar el grupo', error);
                  }
                });
              }

              deleteGruposust(gruposustId: number): void {
                if (!gruposustId) {
                  console.error('Error al eliminar: ID de grupo no proporcionado');
                  return;
                }
              
                const confirmation = confirm('¿Estás seguro de que deseas eliminar este grupo?');
                if (!confirmation) {
                  return;
                }
              
                this._gruposustService.deleteGruposust(gruposustId).subscribe({
                  next: () => {
                    // Eliminar el grupo de la lista en el frontend
                    this.loadGruposusts();
                    this.gruposusts = this.gruposusts.filter(gruposust => gruposust.id !== gruposustId);
                    console.log('Grupo eliminado con éxito');
                    this.selectedGruposust = null; // Resetea la selección si se estaba editando el grupo eliminado
                  },
                  error: (error) => {
                    console.error('Error al eliminar el grupo', error);
                  }
                });
              }             

              loadGruposusts(): void {
                this._gruposustService.getGruposusts().subscribe({
                  next: (data) => {
                    this.gruposusts = data;
                    this.filteredGruposusts = data;
                    this.applyFilter();
                  },
                  error: (error) => console.error(error)
                });
              }

              applyFilter(): void {
                this.filteredGruposusts = this.searchTerm
                  ? this.gruposusts.filter(gruposust =>
                      gruposust.name.toLowerCase().includes(this.searchTerm.toLowerCase())                                       
                    )
                  : this.gruposusts;
              }
            
              orderBy(field: string): void {
                // Si el campo actual es igual al nuevo, cambia la dirección, si no, establece la dirección a ascendente
                if (this.currentField === field) {
                  this.orderAsc = !this.orderAsc;
                } else {
                  this.orderAsc = true;
                  this.currentField = field;
                }
              
                this.filteredGruposusts.sort((a, b) => {
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
                this.selectedGruposust = null;
                this.searchTerm = '';
                this.applyFilter();
              }

              
              
}