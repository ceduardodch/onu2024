import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
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
    RouterLink, MatButtonModule,MatFormField, ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,MatSelectModule,MatSlideToggleModule,
    MatCheckboxModule, MatProgressSpinnerModule,MatSnackBarModule,
    FormsModule,QuillEditorComponent
  ],
  templateUrl: './crear-cupo.html',

})
export class CrearCupo implements OnInit{
        cupos: Cupo[] = []; // Cambiado a array regular para manejar la lista
        newCupo:Cupo = { importador_id:0,
          importador: '', anio: '', hfc: '', hcfc: ''};

        anios: any[];

        importadors: any[];

        signInForm: FormGroup;

        constructor(
          private _cupoService: CupoService,
          private _importadorService: ImportadorService,
          private _anioService: AnioService,
          private _formBuilder: FormBuilder,
          private _snackBar: MatSnackBar,
          public dialogRef: MatDialogRef<CrearCupo>,

        ) {}

            ngOnInit(): void {

                this._cupoService.getCupos().subscribe({
                    next: (data) => {
                      this.cupos = data;
                    },
                    error: (error) => console.error(error)
                  });

                this._importadorService.getImportadors().subscribe({
                    next: (data) => {
                        this.importadors = data;
                    },
                    error: (error) => {
                        console.error('Error al cargar importadores', error);
                        this.openSnackBar('Error al cargar importadores', 'Cerrar');
                    }
                });

                this._anioService.getAnios().subscribe({
                    next: (data) => {
                        this.anios = data;
                    },
                    error: (error) => {
                        console.error('Error al cargar años', error);
                        this.openSnackBar('Error al cargar años', 'Cerrar');
                    }
                });

            this.signInForm = this._formBuilder.group({
                importador: ['', Validators.required],
                anio: ['', Validators.required],
                hfc     :new FormControl ('', [Validators.required]),
                hcfc    :new FormControl ('', [Validators.required]),
              });

            }


            openSnackBar(message: string, action: string) {
              this._snackBar.open(message, action, {
                duration: 2000, // Duración de la notificación
                horizontalPosition: 'center', // Posición horizontal
                verticalPosition: 'top', // Posición vertical
              });
            }

            onSubmit() {
                // Primero verifica si el formulario es válido
                if (this.signInForm.valid) {
                  // Se usa value del formulario reactivo en lugar de newCupo
                  const cupoData = this.signInForm.value;

                  // Revisar si el importador ya tiene un cupo asignado
                  const importExists = this.cupos.some(cupo => cupo.importador === cupoData.importador.trim());
                  if (importExists) {
                    this.openSnackBar('El importador ya tiene un cupo asignado.', 'Error');
                    return;
                  }

                  // Llamar al servicio para agregar el cupo con los datos del formulario
                  this._cupoService.addCupo(cupoData).subscribe({
                    next: () => {
                      this.openSnackBar('Cupo agregado exitosamente.', 'Success');
                      this.signInForm.reset(); // Limpiar el formulario
                      this.dialogRef.close(cupoData); // Cerrar el diálogo (si se está utilizando)
                    },
                    error: (error) => {
                      console.error('Error al agregar el cupo', error);
                      this.openSnackBar('Error al agregar el cupo. Por favor intente nuevamente.', 'Error');
                    }
                  });
                } else {
                  this.openSnackBar('Por favor complete el formulario correctamente.', 'Error');
                }
              }

            isDataComplete(): boolean {
                return this.signInForm.valid;

            }

    }
