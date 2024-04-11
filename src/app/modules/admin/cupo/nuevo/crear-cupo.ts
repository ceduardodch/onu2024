import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
import { AnioService } from '../../anio/anio.service';
import { DetalleProductosComponent } from '../../importacion/detalle-productos/detalle-productos.component';
import { ImportadorService } from '../../importador/importador.service';
import { Cupo } from './../cupo.model'; // Import the 'cupo' class from the appropriate file
import { CupoService } from './../cupo.service';

@Component({
  selector: 'app-crearcupo',
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
  templateUrl: './crear-cupo.html',
  
})
export class CrearCupo implements OnInit{
        cupos: Cupo[] = []; // Cambiado a array regular para manejar la lista
        newCupo:Cupo = {
          importador: '', anio: '', hfc: '', hcfc: ''};
        filteredCupos: Cupo[] = [];
        searchTerm: string = '';
        selectedCupo:  Cupo | null = null;
        orderAsc: boolean = true;
        currentField: string = '';

        anios: any[];        

        importadors: any[];        

        signInForm: FormGroup; 

        constructor(
          private _cupoService: CupoService,
          private _importadorService: ImportadorService,
          private _anioService: AnioService,
          private _formBuilder: FormBuilder,
          private _snackBar: MatSnackBar,
          public dialogRef: MatDialogRef<DetalleProductosComponent>
          
        ) { }

            ngOnInit(): void {

            this.loadCupos();

            this.signInForm = this._formBuilder.group({
              importador: ['', Validators.required],
              anio: ['', Validators.required],
              hfc     :new FormControl ('', [Validators.required]),            
              hcfc    :new FormControl ('', [Validators.required]),
            });

            this._importadorService.getImportadors().subscribe((data: any[]) => {
              this.importadors = data;
              
            });

            this._anioService.getAnios().subscribe((data1: any[]) => {
              this.anios = data1;
              
            });

            }

            openSnackBar(message: string, action: string) {
              this._snackBar.open(message, action, {
                duration: 2000, // Duración de la notificación
                horizontalPosition: 'center', // Posición horizontal
                verticalPosition: 'top', // Posición vertical
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
        const importo = this.signInForm.get('importador').value;
        if (!this.signInForm.valid) {
          this.openSnackBar('Por favor complete el formulario correctamente.', 'Error');
          return;
        }          
        const importExists = this.cupos.some(cupo => cupo.importador === importo.trim());
        if (importExists) {
          this.openSnackBar('El importador ya tiene cupo.', 'Error');
          return;
        }    
      
        // Crear un nuevo objeto Anio con el nombre y el estado activo
        const newCupo: Cupo = {
          importador: this.newCupo.importador, // Asegúrate de que estos valores se establezcan correctamente
          anio: this.newCupo.anio,
          hfc: this.signInForm.value.hfc.trim(),
          hcfc: this.signInForm.value.hcfc.trim()
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

      loadCupos(): void {
        this._cupoService.getCupos().subscribe({
          next: (data) => {
            this.cupos = data;
            this.filteredCupos = data;            
          },
          error: (error) => console.error(error)
        });
      }

      onSubmit() {
        console.log(this.signInForm.value);
        if (this.isDataComplete()) {

            const formData = this.signInForm.value;
            console.log(formData);
            this.dialogRef.close(formData);

    }
    }
    isDataComplete(): boolean {
        return this.signInForm.valid;

    }
    
    }
