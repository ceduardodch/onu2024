import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

import { Anio } from './anio.model'; // Import the 'anio' class from the appropriate file
import { AnioService } from './anio.service';

@Component({
  selector: 'app-anioes',
  standalone: true,
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule,MatAutocompleteModule,
    RouterLink, MatButtonModule, CdkScrollable,MatFormField, ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,MatSelectModule,MatSlideToggleModule,
    MatCheckboxModule, MatProgressSpinnerModule,MatSnackBarModule,
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
          name: '', activo: false};
        filteredAnios: Anio[] = [];
        searchTerm: string = '';
        selectedAnio:  Anio | null = null;
        orderAsc: boolean = true;
        currentField: string = '';
                
        signInForm: FormGroup;        

        constructor(
          private _anioService: AnioService,
          private _formBuilder: FormBuilder,
          private _snackBar: MatSnackBar,
        ) { }

            ngOnInit(): void {

            this.loadAnios();

            this.signInForm = this._formBuilder.group({
              name     : ['', [Validators.required]],            
              activo: [false],
            });

            }

            openSnackBar(message: string, action: string) {
              this._snackBar.open(message, action, {
                duration: 2000, // Duración de la notificación
                horizontalPosition: 'center', // Posición horizontal
                verticalPosition: 'top', // Posición vertical
              });
            }

            onActivoChange(event: MatSlideToggleChange, anio: Anio): void {
              anio.activo = event.checked;
            }            

            addAnio(): void {
              const name = this.signInForm.get('name').value;
              if (!name.trim()) {
                this.openSnackBar('Ingrese el año.', 'Error');
                return;
              }
            
              const yearExists = this.anios.some(anio => anio.name === name.trim());
              if (yearExists) {
                this.openSnackBar('El año ya existe.', 'Error');
                return;
              }
            
              // Crear un nuevo objeto Anio con el nombre y el estado activo
              const newAnio: Anio = {
                name: name.trim(),
                activo: this.signInForm.get('activo').value
              };
            
              // Usar el servicio AnioService para enviar los datos
              this._anioService.addAnio(newAnio).subscribe({
                next: () => {                                    
                  this.openSnackBar('Año agregado exitosamente.', 'Success');                  
                  this.signInForm.reset();
                  this.loadAnios();
                },
                error: (error) => {                  
                  console.error('Error al agregar el año', error);
                  this.openSnackBar('Error al agregar el año. Intente de nuevo.', 'Error');
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
                    const index = this.anios.findIndex(anio => anio.id === updatedAnio.id);
                    if (index !== -1) {
                      this.anios[index] = updatedAnio;
                    }
                    console.log('Año actualizado:', response);
                    this.selectedAnio = null; 
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
                    this.loadAnios();
                    this.anios = this.anios.filter(anio => anio.id !== anioId);
                    this.openSnackBar('Año eliminado exitosamente.', '');
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
                      anio.name.toLowerCase().includes(this.searchTerm.toLowerCase())                       
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