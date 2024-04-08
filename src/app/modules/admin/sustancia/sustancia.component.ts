import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Sustancia } from './sustancia.model'; // Import the 'User' class from the appropriate file
import { SustanciaService } from './sustancia.service';

import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GruposustService } from '../gruposust/gruposust.service';

@Component({
  selector: 'app-sustancias',
  standalone: true, 
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule,MatAutocompleteModule,
    RouterLink, MatButtonModule, CdkScrollable,MatFormField, ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,MatSelectModule,
  ],
  animations: [
    trigger('fadeOutRight', [
      state('void', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition(':leave', [
        animate('0.5s ease-out')
      ])
    ])
  ],
  templateUrl: './sustancia.component.html',
  styleUrl: './sustancia.component.scss'
})
export class SustanciasComponent implements OnInit{
        sustancias: Sustancia[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newSustancia:Sustancia = {
           name: '', subpartida: '', pao: '', pcg: '', grupo_sust: '', activo: false, cupo_prod: false};
        filteredSustancias: Sustancia[] = [];
        searchTerm: string = '';
        selectedSustancia:  Sustancia | null = null;
        orderAsc: boolean = true;
        currentField: string = '';
        gruposusts: any[];
        importadorControl = new FormControl();

        constructor(
          private _sustanciaService: SustanciaService,
          private _gruposustService: GruposustService
        ) { }

        ngOnInit(): void {

          this.loadSustancias();

          this._gruposustService.getGruposusts().subscribe((data: any[]) => {
            this.gruposusts = data;
          });

            }

            onGrupoSelected(event: MatAutocompleteSelectedEvent) {
              if (event?.option?.value) {
                this.newSustancia.grupo_sust = event.option.value;
              } else {
                // Manejo de error: se seleccionó una opción no válida o el evento está indefinido.
                console.error('El evento o la opción seleccionada son indefinidos');
              }
            }

            // Esta función se activa cuando se cambia el estado del checkbox de 'activo'
            onActivoChange(event: MatCheckboxChange, sustancia: Sustancia): void {
              sustancia.activo = event.checked;
            }

            addSustancia(): void {
              // Validación de que todos los campos necesarios están presentes
              if (!this.newSustancia.name || !this.newSustancia.subpartida || !this.newSustancia.pao || !this.newSustancia.pcg || !this.newSustancia.grupo_sust) {
                console.error('Todos los campos deben estar llenos.');
                return; // Salir de la función si alguna validación falla
              }
            
              // Si todo está bien, procede a agregar la sustancia
              this._sustanciaService.addSustancia(this.newSustancia).subscribe({
                next: () => {
                  this.loadSustancias();
                  // Restablece el objeto `newSustancia` a sus valores por defecto
                  this.newSustancia = {  
                    name: '', subpartida: '', pao:'', pcg: '', grupo_sust: '', activo: false, cupo_prod: false};
                },
                error: (error) => {
                  console.error('Error al agregar la sustancia', error);
                }
              });
            }

              selectSustanciaForEdit(sustancia: Sustancia): void {
                this.selectedSustancia = { ...sustancia };               
              }
            
              updateSustancia(updatedSustancia: Sustancia): void {
                
                if (!updatedSustancia.id) {
                  console.error('Error al actualizar: ID de sustancia no proporcionado');
                  return;
                }
                this._sustanciaService.updateSustancia(updatedSustancia.id, updatedSustancia).subscribe({
                  next: (response) => {
                    // Actualizar la lista de sustancias en el frontend
                    const index = this.sustancias.findIndex(sustancia => sustancia.id === updatedSustancia.id);
                    if (index !== -1) {
                      this.sustancias[index] = updatedSustancia;
                    }
                    console.log('Sustancia actualizada:', response);
                    this.selectedSustancia = null; // Resetea la selección para cerrar el formulario de edición
                  },
                  error: (error) => {
                    console.error('Error al actualizar el sustancia', error);
                  }
                });
              }

              deleteSustancia(sustanciaId: number): void {
                if (!sustanciaId) {
                  console.error('Error al eliminar: ID de sustancia no proporcionado');
                  return;
                }
              
                const confirmation = confirm('¿Estás seguro de que deseas eliminar este sustancia?');
                if (!confirmation) {
                  return;
                }
              
                this._sustanciaService.deleteSustancia(sustanciaId).subscribe({
                  next: () => {
                    // Eliminar el sustancia de la lista en el frontend
                    this.loadSustancias();
                    this.sustancias = this.sustancias.filter(sustancia => sustancia.id !== sustanciaId);
                    console.log('Sustancia eliminado con éxito');
                    this.selectedSustancia = null; // Resetea la selección si se estaba editando el país eliminado
                  },
                  error: (error) => {
                    console.error('Error al eliminar el sustancia', error);
                  }
                });
              }             

              loadSustancias(): void {
                this._sustanciaService.getSustancias().subscribe({
                  next: (data) => {
                    this.sustancias = data;
                    this.filteredSustancias = data;
                    this.applyFilter();
                  },
                  error: (error) => console.error(error)
                });
              }

              applyFilter(): void {
                this.filteredSustancias = this.searchTerm
                  ? this.sustancias.filter(sustancia =>
                    sustancia.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    sustancia.subpartida.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    sustancia.pao.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    sustancia.pcg.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    sustancia.grupo_sust.toLowerCase().includes(this.searchTerm.toLowerCase()) 
                    )
                  : this.sustancias;
              }
            
              orderBy(field: string): void {
                // Si el campo actual es igual al nuevo, cambia la dirección, si no, establece la dirección a ascendente
                if (this.currentField === field) {
                  this.orderAsc = !this.orderAsc;
                } else {
                  this.orderAsc = true;
                  this.currentField = field;
                }
              
                this.filteredSustancias.sort((a, b) => {
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
                this.selectedSustancia = null;
                this.searchTerm = '';
                this.applyFilter();
              }
}