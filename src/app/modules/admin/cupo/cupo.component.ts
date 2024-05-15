import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';

import { Cupo } from './cupo.model'; // Import the 'cupo' class from the appropriate file
import { CupoService } from './cupo.service';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { AnioService } from '../anio/anio.service';
import { ImportadorService } from '../importador/importador.service';
import { CrearCupo } from './nuevo/crear-cupo';

@Component({
  selector: 'app-cupos',
  standalone: true,
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule,MatAutocompleteModule,
    RouterLink, MatButtonModule, CdkScrollable,MatFormField, ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,MatSelectModule,MatSlideToggleModule, CrearCupo,
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
  templateUrl: './cupo.component.html',
  styleUrls: ['./cupo.component.scss']
})
export class CuposComponent implements OnInit{
        cupos: Cupo[] = []; // Cambiado a array regular para manejar la lista
        newCupo:Cupo = {
          importador_id: 0,importador: '', anio: '', hfc: '', hcfc: ''};
        filteredCupos: Cupo[] = [];
        searchTerm: string = '';
        selectedCupo:  Cupo | null = null;
        orderAsc: boolean = true;
        currentField: string = '';

        anios: any[] = [];  
        aniosControl = new FormControl();
        aniosFiltrados$: Observable<any[]>;         

        importadors: any[] = [];  
        importControl = new FormControl();
        importFiltrados$: Observable<any[]>;

        signInForm: FormGroup; 
        editCupoForm: FormGroup;   

        constructor(
          private _cupoService: CupoService,
          private _importadorService: ImportadorService,
          private _anioService: AnioService,
          private _formBuilder: FormBuilder,
          private _snackBar: MatSnackBar,
          public dialog: MatDialog,          
          

        ) { }

            ngOnInit(): void {

            this.loadCupos();

            this.signInForm = this._formBuilder.group({
              importador_id: [0, Validators.required],
              importador: ['', Validators.required],
              anio: ['', Validators.required],
              hfc     : ['', [Validators.required]],
              hcfc    : ['', [Validators.required]],
            });

            this._importadorService.getImportadors().subscribe((data: any[]) => {
              this.importadors = data;
            });

            this._anioService.getAniosActivo().subscribe((data: any[]) => {
              this.anios = data;
            });

            this.aniosFiltrados$ = this.aniosControl.valueChanges.pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.name),
              map(name => name ? this._filter(name) : this.anios.slice())
            );
            
            this.importFiltrados$ = this.importControl.valueChanges.pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.name),
              map(name => name ? this._filter2(name) : this.importadors.slice())
            );  

            this._cupoService.getCupos().subscribe(data => {
              this.cupos = data;
              this.filteredCupos = data;
            });
  
            this.editCupoForm = this._formBuilder.group({              
              
              importador: ['', Validators.required],
              anio: ['', Validators.required],
              hfc: ['', Validators.required],
              hcfc: ['', Validators.required],              
            });

            }

            private _filter(name: string): any[] {
              if (!name) {
                return this.anios.slice();
              }
              const filterValue = name.toLowerCase();
              return this.anios.filter(option => option && option.name.toLowerCase().includes(filterValue));
            }
            
            private _filter2(name: string): any[] {
              if (!name) {
                return this.importadors.slice();
              }
              const filterValue1 = name.toLowerCase();
              return this.importadors.filter(option => option && option.name.toLowerCase().includes(filterValue1));
            }
          
            openSnackBar(message: string, action: string) {
              this._snackBar.open(message, action, {
                duration: 2000, // Duración de la notificación
                horizontalPosition: 'center', // Posición horizontal
                verticalPosition: 'top', // Posición vertical
              });
            }

            

            onImportSelected(event: MatAutocompleteSelectedEvent): void {
              if (event?.option?.value) {
                const importador = event.option.value; // Aquí obtienes el objeto completo
                this.signInForm.get('importador_id').setValue(importador.id);
                //console.log('importador_id', importador.id); // Establece el ID en el formulario
                this.signInForm.get('importador').setValue(importador.name);
                //console.log('importador', importador.name); // Establece el nombre en el formulario para otros usos
                this.importControl.setValue(importador.name); // Asegura que el input muestre el nombre correctamente
              } else {
                console.error('El evento o la opción seleccionada son indefinidos');
              }
            }

            onAnioSelected(event: MatAutocompleteSelectedEvent) {
              if (event?.option?.value) {                
                this.signInForm.get('anio').setValue(event.option.value);
              } else {                
                console.error('El evento o la opción seleccionada son indefinidos');
              }
            }

            openDialog() {

              const dialogRef = this.dialog.open(CrearCupo, {
                  //width: '600px',
                  //height: '420px'
                });
                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    this.cupos.push(result);
                    this.cupos = [...this.cupos]; 
                    this.filteredCupos = this.cupos.slice();   
                    this.loadCupos();               
                    }                
              });
            }                                 

            selectCupoForEdit(cupo: Cupo): void {
              this.selectedCupo = { ...cupo };              
   
              if (cupo) {
                  // Asignar los valores al formulario para edición
                  this.editCupoForm.patchValue({
                      
                      importador: cupo.importador || '',
                      anio: cupo.anio || '',
                      hfc: cupo.hfc || '',
                      hcfc: cupo.hcfc || ''
                  });
          
                  // Establecer los valores actuales para los campos de autocompletado
                  this.importControl.setValue(cupo.importador_id);
                  //console.log('importador_id', cupo.importador_id);
                  this.importControl.setValue(cupo.importador);
                  this.aniosControl.setValue(cupo.anio);

              } else {
                  console.error('Error: No se proporcionó un cupo válido para editar.');
              }
          }

              updateCupo(): void {
                if (!this.editCupoForm.valid) {
                  this.openSnackBar('Por favor complete el formulario.', 'Error');
                  return;
                }
                
                const updatedCupo: Cupo = {
                  ...this.selectedCupo, // Preserva otros campos existentes
                  
                  importador: this.editCupoForm.get('importador').value,
                  anio: this.editCupoForm.get('anio').value,
                  hfc: this.editCupoForm.get('hfc').value,
                  hcfc: this.editCupoForm.get('hcfc').value,
                };
              
                this._cupoService.updateCupo(updatedCupo.id, updatedCupo).subscribe({
                  next: (response) => {
                    // Actualiza la lista de cupos en el frontend
                    const index = this.cupos.findIndex(cupo => cupo.id === updatedCupo.id);
                    console.log('importador', index);
                    if (index !== -1) {
                      this.cupos[index] = updatedCupo;
                    }
                    console.log('Cupo actualizado:', response);
                    this.openSnackBar('Cupo actualizado exitosamente.', 'Success');
                    this.selectedCupo = null; // Resetear selección para cerrar el formulario de edición
                  },
                  error: (error) => {
                    console.error('Error al actualizar el cupo', error);
                    this.openSnackBar('Error al actualizar el cupo. Por favor intente nuevamente.', 'Error');
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
                  error: (error) => {
                    console.error('Error al cargar los cupos', error);
                    this.openSnackBar('Error al cargar los cupos. Por favor ingrese otro año.', 'Error');
                  }
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