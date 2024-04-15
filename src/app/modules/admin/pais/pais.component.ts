import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Pais } from './pais.model'; // Import the 'pais' class from the appropriate file
import { PaisService } from './pais.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-paises',
  standalone: true,
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule,MatAutocompleteModule,
    RouterLink, MatButtonModule, CdkScrollable,MatFormField, ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,MatSelectModule,MatSlideToggleModule,
    MatCheckboxModule,MatProgressSpinnerModule,MatSnackBarModule,
  ],
  animations: [
    trigger('fadeOutRight', [
      state('void', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition(':leave', [
        animate('0.5s ease-out')
      ])
    ])
  ],
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.scss']
})
export class PaisesComponent implements OnInit{
        paises: Pais[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newPais:Pais = {name: ''};
        filteredPaises: Pais[] = [];
        searchTerm: string = '';
        selectedPais:  Pais | null = null;
        orderAsc: boolean = true;
        currentField: string = '';

        signInForm: FormGroup;        

        constructor(
          private _paisService: PaisService,
          private _formBuilder: FormBuilder,
          private _snackBar: MatSnackBar,
          private http: HttpClient,
        ) { }

            ngOnInit(): void {

            this.loadPaises();

            this.signInForm = this._formBuilder.group({
              name     : ['', [Validators.required]]                          
            });

            }

            openSnackBar(message: string, action: string) {
              this._snackBar.open(message, action, {
                duration: 2000, // Duración de la notificación
                horizontalPosition: 'center', // Posición horizontal
                verticalPosition: 'top', // Posición vertical
              });
            }

            addPais(): void {

              const name = this.signInForm.get('name').value;
              if (!name.trim()) {
                this.openSnackBar('Ingrese el nombre del país.', 'Error');
                return;
              }
            
              const nameExists = this.paises.some(pais => pais.name === name.trim());
              if (nameExists) {
                this.openSnackBar('El nombre del país ya existe.', 'Error');
                return;
              }
            
              // Crear un nuevo objeto Anio con el nombre y el estado activo
              const newPais: Pais = {
                name: name.trim()                
              };
              
              this._paisService.addPais(newPais).subscribe({
                next: () => {
                  this.openSnackBar('País agregado exitosamente.', 'Success');                  
                  this.signInForm.reset();
                  this.loadPaises();                  
                },
                error: (error) => {                  
                  console.error('Error al agregar el país', error);
                  this.openSnackBar('Error al agregar el país. Intente de nuevo.', 'Error');
                }
              });
              }        

            selectPaisForEdit(pais: Pais): void {
              console.log('Seleccionando país para editar:', pais);
              // Aquí se permite el ID cero como válido.
              if (pais && (pais.id || pais.id === 0)) {
                this.selectedPais = { ...pais };
              } else {
                console.error('El país seleccionado no tiene un ID válido.');
              }
            }
            
          
                updatePais(updatedPais: Pais): void {
                  // Verificar que el pais tenga un 
                  console.log('Intentando actualizar el país:', updatedPais);
                  if (!updatedPais || !updatedPais.id) {
                    console.error('Error al actualizar: ID de país no proporcionado');
                    return;
                  }
                  
                  this._paisService.updatePais(updatedPais.id, updatedPais).subscribe({
                    next: (response) => {
                      // Encuentra el país actualizado y actualiza la lista
                      const index = this.paises.findIndex(p => p.id === updatedPais.id);
                      if (index !== -1) {
                        this.paises[index] = { ...updatedPais, ...response };
                      }

                      this.paises = [...this.paises];
                      this.filteredPaises = this.paises;

                      console.log('País actualizado:', response);
                      this.selectedPais = null;
                    },
                    error: (error) => {
                      console.error('Error al actualizar el país', error);
                    }
                  });
                }

              deletePais(paisId: number): void {
                if (!paisId) {
                  console.error('Error al eliminar: ID de país no proporcionado');
                  return;
                }
              
                const confirmation = confirm('¿Estás seguro de que deseas eliminar este país?');
                if (!confirmation) {
                  return;
                }
              
                this._paisService.deletePais(paisId).subscribe({
                  next: () => {
                    // Eliminar el país de la lista en el frontend
                    this.loadPaises();
                    this.paises = this.paises.filter(pais => pais.id !== paisId);
                    console.log('País eliminado con éxito');
                    this.selectedPais = null; // Resetea la selección si se estaba editando el país eliminado
                  },
                  error: (error) => {
                    console.error('Error al eliminar el país', error);
                  }
                });
              }             

              loadPaises(): void {
                this._paisService.getPaises().subscribe({
                  next: (data) => {
                    this.paises = data;
                    this.filteredPaises = data;
                    this.applyFilter();
                  },
                  error: (error) => console.error(error)
                });
              }

              applyFilter(): void {
                this.filteredPaises = this.searchTerm
                  ? this.paises.filter(pais =>
                      pais.name.toLowerCase().includes(this.searchTerm.toLowerCase())                     
                    )
                  : this.paises;
              }
            
              orderBy(field: string): void {
                // Si el campo actual es igual al nuevo, cambia la dirección, si no, establece la dirección a ascendente
                if (this.currentField === field) {
                  this.orderAsc = !this.orderAsc;
                } else {
                  this.orderAsc = true;
                  this.currentField = field;
                }
              
                this.filteredPaises.sort((a, b) => {
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
                this.selectedPais = null;
                this.searchTerm = '';
                this.applyFilter();
              }         
              
}