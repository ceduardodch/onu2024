import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { Importador } from './importador.model'; // Import the 'User' class from the appropriate file
import { ImportadorService } from './importador.service';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-importadors',
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
  templateUrl: './importador.component.html',
  styleUrl: './importador.component.scss'
})
export class ImportadorsComponent implements OnInit{
        importadors: Importador[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newImportador:Importador = {
          name: '', ruc: '', phone: '', user_import:''};
        filteredImportadores: Importador[] = [];
        searchTerm: string = '';
        selectedImportador:  Importador | null = null;
        orderAsc: boolean = true;
        currentField: string = '';

        usuarios: any[];
        
        signInForm: FormGroup;

        constructor(
          private _importadorService: ImportadorService,
          private _userService: UserService,
          private _formBuilder: FormBuilder,
          private _snackBar: MatSnackBar,
        ) { }

        ngOnInit(): void {

          this.loadImportadores();

          this.signInForm = this._formBuilder.group({                           
            name     : ['', [Validators.required]],            
            ruc    : ['', [Validators.required]],
            phone    : ['', [Validators.required]],
            user_import : ['', [Validators.required]],
          });

          this._userService.getUsers().subscribe((data: any[]) => {
            this.usuarios = data;
          });

          }

          openSnackBar(message: string, action: string) {
            this._snackBar.open(message, action, {
              duration: 2000, // Duración de la notificación
              horizontalPosition: 'center', // Posición horizontal
              verticalPosition: 'top', // Posición vertical
            });
          }

          onUserSelected(event: MatAutocompleteSelectedEvent) {
            if (event?.option?.value) {
              this.newImportador.user_import = event.option.value;
            } else {
              // Manejo de error: se seleccionó una opción no válida o el evento está indefinido.
              console.error('El evento o la opción seleccionada son indefinidos');
            }
          }

          addImportador(): void {

            const name = this.signInForm.get('user_import').value;
              if (!this.signInForm.valid) {
                this.openSnackBar('Por favor complete el formulario correctamente.', 'Error');
                return;
              }          
              const importExists = this.importadors.some(importador => importador.name === name.trim());
              if (importExists) {
                this.openSnackBar('El importador ya existe.', 'Error');
                return;
              }    
            
              // Crear un nuevo objeto Anio con el nombre y el estado activo
              const newImportador: Importador = {
                
                name: this.signInForm.value.name.trim(),
                ruc: this.signInForm.value.ruc.trim(),
                phone: this.signInForm.value.phone.trim(),
                user_import: this.newImportador.user_import, // Asegúrate de que estos valores se establezcan correctamente                
              };

            this._importadorService.addImportador(newImportador).subscribe({
              next: () => {
                this.openSnackBar('Importador agregado exitosamente.', 'Success');                  
                this.signInForm.reset();
                this.loadImportadores();                
              },
              error: (error) => {
                console.error('Error al agregar el importador', error);
                this.openSnackBar('Error al agregar el importador. Por favor intente nuevamente.', 'Error');    
              }
            });
          }

            selectImportadorForEdit(importador: Importador): void {
              this.selectedImportador = { ...importador };               
            }
          
            updateImportador(updatedImportador: Importador): void {
              
              if (!updatedImportador.id) {
                console.error('Error al actualizar: ID de importador no proporcionado');
                return;
              }
              this._importadorService.updateImportador(updatedImportador.id, updatedImportador).subscribe({
                next: (response) => {
                  // Actualizar la lista de importador en el frontend
                  const index = this.importadors.findIndex(importador => importador.id === updatedImportador.id);
                  if (index !== -1) {
                    this.importadors[index] = updatedImportador;
                  }
                  console.log('Importador actualizado:', response);
                  this.selectedImportador = null; // Resetea la selección para cerrar el formulario de edición
                },
                error: (error) => {
                  console.error('Error al actualizar el importador', error);
                }
              });
            }

            deleteImportador(importadorId: number): void {
              if (!importadorId) {
                console.error('Error al eliminar: ID de importador no proporcionado');
                return;
              }
            
              const confirmation = confirm('¿Estás seguro de que deseas eliminar este importador?');
              if (!confirmation) {
                return;
              }
            
              this._importadorService.deleteImportador(importadorId).subscribe({
                next: () => {
                  // Eliminar el importador de la lista en el frontend
                  this.loadImportadores();
                  this.importadors = this.importadors.filter(importador => importador.id !== importadorId);
                  console.log('Importador eliminado con éxito');
                  this.selectedImportador = null; // Resetea la selección si se estaba editando el país eliminado
                },
                error: (error) => {
                  console.error('Error al eliminar el importador', error);
                }
              });
            }             

            loadImportadores(): void {
              this._importadorService.getImportadors().subscribe({
                next: (data) => {
                  this.importadors = data;
                  this.filteredImportadores = data;
                  this.applyFilter();
                },
                error: (error) => console.error(error)
              });
            }

            applyFilter(): void {
              this.filteredImportadores = this.searchTerm
                ? this.importadors.filter(importador =>
                    importador.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    importador.ruc.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    importador.phone.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    importador.user_import.toLowerCase().includes(this.searchTerm.toLowerCase())                                      
                  )
                : this.importadors;
            }
          
            orderBy(field: string): void {
              // Si el campo actual es igual al nuevo, cambia la dirección, si no, establece la dirección a ascendente
              if (this.currentField === field) {
                this.orderAsc = !this.orderAsc;
              } else {
                this.orderAsc = true;
                this.currentField = field;
              }
            
              this.filteredImportadores.sort((a, b) => {
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
              this.selectedImportador = null;
              this.searchTerm = '';
              this.applyFilter();
            }
}