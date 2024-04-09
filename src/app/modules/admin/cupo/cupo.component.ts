import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Cupo } from './cupo.model'; // Import the 'cupo' class from the appropriate file
import { CupoService } from './cupo.service';

import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AnioService } from '../anio/anio.service';
import { ImportadorService } from '../importador/importador.service';

@Component({
  selector: 'app-cupoes',
  standalone: true,
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule,MatAutocompleteModule, 
    RouterLink, MatButtonModule, CdkScrollable,MatFormField,MatFormFieldModule,
    MatInputModule,MatSelectModule,MatSlideToggleModule,ReactiveFormsModule,
  ],
  animations: [
    trigger('fadeOutRight', [
      state('void', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition(':leave', [
        animate('0.5s ease-out')
      ])
    ])
  ],
  templateUrl: './cupo.component.html',
  styleUrls: ['./cupo.component.scss']
})
export class CuposComponent implements OnInit{
        cupos: Cupo[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newCupo:Cupo = {
          importador: '', anio: '', hfc: '', hcfc: ''};
        filteredCupos: Cupo[] = [];
        searchTerm: string = '';
        selectedCupo:  Cupo | null = null;
        orderAsc: boolean = true;
        currentField: string = '';

        anios: any[];
        importadors: any[];

        constructor(
          private _cupoService: CupoService,
          private _importadorService: ImportadorService,
          private _anioService: AnioService
          
        ) { }

            ngOnInit(): void {

            this.loadCupos();

            this._importadorService.getImportadors().subscribe((data: any[]) => {
              this.importadors = data;
            });

            this._anioService.getAnios().subscribe((data1: any[]) => {
              this.anios = data1;
            });

            }

            onImportSelected(event: MatAutocompleteSelectedEvent) {
              if (event?.option?.value) {
                this.newCupo.importador = event.option.value;
              } else {
                // Manejo de error: se seleccionó una opción no válida o el evento está indefinido.
                console.error('El evento o la opción seleccionada son indefinidos');
              }
            }

            onAnioSelected(event: MatAutocompleteSelectedEvent) {
              if (event?.option?.value) {
                this.newCupo.anio = event.option.value;
              } else {
                // Manejo de error: se seleccionó una opción no válida o el evento está indefinido.
                console.error('El evento o la opción seleccionada son indefinidos');
              }
            }

            addCupo(): void {
              this._cupoService.addCupo(this.newCupo).subscribe({
                next: () => {
                  this.loadCupos();
                  this.newCupo = { importador: '', anio: '', hfc: '', hcfc: ''};// Restablece el objeto `newCupo`
                },
                error: (error) => {
                  console.error('Error al agregar el cupo', error);
                }
              });
            }

              selectCupoForEdit(cupo: Cupo): void {
                this.selectedCupo = { ...cupo };               
              }
            
              updateCupo(updatedCupo: Cupo): void {
                
                if (!updatedCupo.id) {
                  console.error('Error al actualizar: ID de cupo no proporcionado');
                  return;
                }
                this._cupoService.updateCupo(updatedCupo.id, updatedCupo).subscribe({
                  next: (response) => {
                    // Actualizar la lista de países en el frontend
                    const index = this.cupos.findIndex(cupo => cupo.id === updatedCupo.id);
                    if (index !== -1) {
                      this.cupos[index] = updatedCupo;
                    }
                    console.log('Cupo actualizado:', response);
                    this.selectedCupo = null; // Resetea la selección para cerrar el formulario de edición
                  },
                  error: (error) => {
                    console.error('Error al actualizar el cupo', error);
                  }
                });
              }

              deleteCupo(cupoId: number): void {
                if (!cupoId) {
                  console.error('Error al eliminar: ID de cupo no proporcionado');
                  return;
                }
              
                const confirmation = confirm('¿Estás seguro de que deseas eliminar este cupo?');
                if (!confirmation) {
                  return;
                }
              
                this._cupoService.deleteCupo(cupoId).subscribe({
                  next: () => {
                    // Eliminar el país de la lista en el frontend
                    this.loadCupos();
                    this.cupos = this.cupos.filter(cupo => cupo.id !== cupoId);
                    console.log('Cupo eliminado con éxito');
                    this.selectedCupo = null; // Resetea la selección si se estaba editando el país eliminado
                  },
                  error: (error) => {
                    console.error('Error al eliminar el cupo', error);
                  }
                });
              }             

              loadCupos(): void {
                this._cupoService.getCupos().subscribe({
                  next: (data) => {
                    this.cupos = data;
                    this.filteredCupos = data;
                    this.applyFilter();
                  },
                  error: (error) => console.error(error)
                });
              }

              applyFilter(): void {
                this.filteredCupos = this.searchTerm
                  ? this.cupos.filter(cupo =>
                      cupo.importador.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                      cupo.anio.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                      cupo.hfc.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                      cupo.hcfc.toLowerCase().includes(this.searchTerm.toLowerCase())                    
                    )
                  : this.cupos;
              }
            
              orderBy(field: string): void {
                // Si el campo actual es igual al nuevo, cambia la dirección, si no, establece la dirección a ascendente
                if (this.currentField === field) {
                  this.orderAsc = !this.orderAsc;
                } else {
                  this.orderAsc = true;
                  this.currentField = field;
                }
              
                this.filteredCupos.sort((a, b) => {
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
                this.selectedCupo = null;
                this.searchTerm = '';
                this.applyFilter();
              }

              
              
}