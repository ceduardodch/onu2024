import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, startWith } from 'rxjs';
import { AnioService } from '../../anio/anio.service';
import { ImportadorService } from '../../importador/importador.service';
import { Cupo } from './../cupo.model'; // Import the 'cupo' class from the appropriate file
import { CupoService } from './../cupo.service';

@Component({
  selector: 'app-crearcupo',
  standalone: true,
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,MatIconModule,MatAutocompleteModule,
    MatButtonModule,MatFormField, ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,
    FormsModule
  ],
  templateUrl: './crear-cupo.html',

})
export class CrearCupo implements OnInit{

    @Output() itemReady = new EventEmitter();

        cupos: Cupo[] = []; // Cambiado a array regular para manejar la lista
        newCupo:Cupo = {
          importador_id: 0,importador: '', anio: '', hfc: '', hcfc: ''};

          anios: any[] = [];  
          aniosControl = new FormControl();
          aniosFiltrados$: Observable<any[]>;         
  
          importadors: any[] = [];  
          importControl = new FormControl();
          importFiltrados$: Observable<any[]>;

        signInForm: FormGroup;

        constructor(
          private _cupoService: CupoService,
          private _importadorService: ImportadorService,
          private _anioService: AnioService,
          private _formBuilder: FormBuilder,
          private _snackBar: MatSnackBar,
          public dialogRef: MatDialogRef<CrearCupo>,
          private cdr: ChangeDetectorRef,

        ) {}

            ngOnInit(): void {

              this.itemReady.emit(true);

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
                this.signInForm.get('importador').setValue(importador.name);                
                this.importControl.setValue(importador.name);
                this.cdr.detectChanges();
              } else {
                console.error('El evento o la opción seleccionada son indefinidos');
              }
            }

            onAnioSelected(event: MatAutocompleteSelectedEvent) {
              if (event?.option?.value) {                
                this.signInForm.get('anio').setValue(event.option.value);
                this.cdr.detectChanges();
              } else {                
                console.error('El evento o la opción seleccionada son indefinidos');
              }
            }

            onSubmit() {
              if (!this.signInForm.valid) {
                this.openSnackBar('Por favor complete el formulario correctamente.', 'Error');
                return;
              }
            
              const newCupo: Cupo = {
                importador_id: this.signInForm.get('importador_id')?.value,
                importador: this.signInForm.get('importador').value.trim(),
                anio: this.signInForm.get('anio').value.trim(),
                hfc: this.signInForm.get('hfc').value.trim(),
                hcfc: this.signInForm.get('hcfc').value.trim()
              };
            
              // Verifica si ya existe un cupo para el mismo importador y mismo año
              const cupoExists = this.cupos.some(cupo => cupo.importador_id === newCupo.importador_id && cupo.anio === newCupo.anio);
            
              if (cupoExists) {
                this.openSnackBar('Ya existe un cupo asignado para este importador en el mismo año.', 'Error');
                return;
              }
            
              this._cupoService.addCupo(newCupo).subscribe({
                next: () => {
                  this.openSnackBar('Cupo agregado exitosamente.', 'Success');                  
                  this.dialogRef.close({ success: true, cupo: newCupo });

                },
                error: (error) => {
                  console.error('Error al agregar el cupo', error);
                  // Maneja el error de acuerdo al contenido del mensaje de error específico del backend
                  if (error.status === 400 && error.error.msg.includes('ya existe un cupo asignado')) {
                      this.openSnackBar('El importador ya existe con cupo para ese año. Intente con otro año o importador.', 'Error');
                  } else {
                      this.openSnackBar('Error al agregar el cupo. Por favor intente nuevamente.', 'Error');
                  }
                }
              });
              }

            isDataComplete(): boolean {
                return this.signInForm.valid;

            }

    }
