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
import { FuseVerticalNavigationComponent } from '@fuse/components/navigation';
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
    MatCheckboxModule, MatProgressSpinnerModule,MatSnackBarModule, FuseVerticalNavigationComponent
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
        newCupo:Cupo = { importador_id: 0,
          importador: '', anio: '', hfc: '', hcfc: ''};
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
              importador: ['', Validators.required],
              anio: ['', Validators.required],
              hfc     : ['', [Validators.required]],
              hcfc    : ['', [Validators.required]],
            });

            this._importadorService.getImportadors().subscribe((data: any[]) => {
              this.importadors = data || [];
            });

            this._anioService.getAnios().subscribe((data: any[]) => {
              this.anios = data || [];
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
  
            this.editCupoForm = this._formBuilder.group({              
              //importado_id: ['', Validators.required],
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
              return this.anios.filter(option => option.name.toLowerCase().includes(filterValue));
            }

            private _filter2(name: string): any[] {
              if (!name) {
                return this.importadors.slice();
              }
              const filterValue1 = name.toLowerCase();
              return this.importadors.filter(option => option.name.toLowerCase().includes(filterValue1));
            }


            openSnackBar(message: string, action: string) {
              this._snackBar.open(message, action, {
                duration: 2000, // Duración de la notificación
                horizontalPosition: 'center', // Posición horizontal
                verticalPosition: 'top', // Posición vertical
              });
            }
            /*
onImportSelected(event: MatAutocompleteSelectedEvent): void {
  // Actualiza el valor en el formulario con la opción seleccionada
  this.signInForm.get('importador').setValue(event.option.value);
  // Si estás en modo de edición, también actualiza el editCupoForm
  this.editCupoForm.get('importador').setValue(event.option.value);
}

onAnioSelected(event: MatAutocompleteSelectedEvent): void {
  // Actualiza el valor en el formulario con la opción seleccionada
  this.signInForm.get('anio').setValue(event.option.value);
  // Si estás en modo de edición, también actualiza el editCupoForm
  this.editCupoForm.get('anio').setValue(event.option.value);
}
            }*/
            onImportSelected(event: MatAutocompleteSelectedEvent) {
              if (event?.option?.value) {                
                this.signInForm.get('importador').setValue(event.option.value);
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
                    }                
              });
            }         
            addCupo(): void {
              
              if (!this.signInForm.valid) {
                this.openSnackBar('Por favor complete el formulario correctamente.', 'Error');
                return;
              }
              const importo = this.signInForm.get('importador').value;
              const anio = this.signInForm.get('anio').value;
              const hfc = this.signInForm.get('hfc').value;
              const hcfc = this.signInForm.get('hcfc').value;

              const importExists = this.cupos.some(cupo => cupo.importador === importo.trim());
              if (importExists) {
                this.openSnackBar('El importador ya tiene cupo.', 'Error');
                return;
              }

              // Crear un nuevo objeto Anio con el nombre y el estado activo
              const newCupo: Cupo = {
                //importador_id: this.newCupo.importador_id,
                importador: importo, // Asegúrate de que estos valores se establezcan correctamente
                anio: anio,
                hfc: hfc.trim(),
                hcfc: hcfc.trim()
              };

              this._cupoService.addCupo(newCupo).subscribe({
                next: () => {
                  this.openSnackBar('Cupo agregado exitosamente.', 'Success');
                  this.signInForm.reset();
                  this.loadCupos();
                },
                error: (error) => {
                  console.error('Error al agregar el cupo', error);
                  this.openSnackBar('Error al agregar el cupo. Por favor intente nuevamente.', 'Error');
                }
              });
            }

              selectCupoForEdit(cupo: Cupo): void {
                this.selectedCupo = { ...cupo };
                
                this.aniosControl.setValue(cupo.anio);
                
                this.aniosFiltrados$ = this.aniosControl.valueChanges.pipe(
                  startWith(''), // Inicia con el valor actual
                  map(value => this._filter(value || '')) // Filtra los países basado en la entrada del usuario
                );
                  
                this.editCupoForm.setValue({
                  importador: cupo.importador,
                  anio: cupo.anio,
                  hfc: cupo.hfc,
                  hcfc: cupo.hcfc
                });
                /*
                this.selectedCupo = { ...cupo };
  
                // Establece los valores del formulario de edición con los valores actuales.
                this.editCupoForm.setValue({
                  importador: cupo.importador,
                  anio: cupo.anio,
                  hfc: cupo.hfc,
                  hcfc: cupo.hcfc
                });
  
                // Configura el Observable para el autocompletado del campo 'importador'.
                this.importFiltrados$ = this.importControl.valueChanges
                  .pipe(
                  startWith(''),
                  map(value => this._filter2(value || cupo.importador))
                );
  
                // Configura el Observable para el autocompletado del campo 'anio'.
                this.aniosFiltrados$ = this.aniosControl.valueChanges
                  .pipe(
                  startWith(''),
                  map(value => this._filter(value || cupo.anio))
                );
  
                // Actualiza el valor del control de los campos 'importador' y 'anio'.
                this.importControl.setValue(cupo.importador);
                this.aniosControl.setValue(cupo.anio);
                */
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
/*
              updateCupo(): void {
                // Verificar si el formulario de edición es válido
                if (!this.editCupoForm.valid) {
                  this.openSnackBar('Por favor complete el formulario.', 'Error');
                  return;
                }
                
                // Asumiendo que this.selectedProveedor está actualmente seleccionado para edición
                if (!this.selectedProveedor || this.selectedProveedor.id == null) {
                  this.openSnackBar('No se ha seleccionado ningún proveedor.', 'Error');
                  return;
                }
              
                // Crear un nuevo objeto con los datos actualizados del formulario y el id del proveedor seleccionado
                const updatedProveedor: Proveedor = {
                  ...this.selectedProveedor,
                  ...this.editProveedorForm.value
                };
              
                // Llamar al servicio para actualizar el proveedor
                this._proveedorService.updateProveedor(updatedProveedor.id, updatedProveedor).subscribe({
                  next: (response) => {
                    // Encontrar y actualizar el proveedor en la lista local
                    const index = this.proveedors.findIndex(proveedor => proveedor.id === this.selectedProveedor.id);
                    if (index !== -1) {
                      this.proveedors[index] = updatedProveedor;
                    }
                    console.log('Proveedor actualizado:', response);
                    this.selectedProveedor = null;
                    this.editProveedorForm.reset(); // Resetear el formulario de edición
                    this.openSnackBar('Proveedor actualizado con éxito.', 'Success');
                  },
                  error: (error) => {
                    console.error('Error al actualizar el proveedor', error);
                    this.openSnackBar('Error al actualizar el proveedor. Por favor intente nuevamente.', 'Error');
                  }
                });
              }*/

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