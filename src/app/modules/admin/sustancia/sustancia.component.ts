import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Sustancia } from './sustancia.model'; // Import the 'User' class from the appropriate file
import { SustanciaService } from './sustancia.service';

import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Observable, map } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { GruposustService } from '../gruposust/gruposust.service';


@Component({
  selector: 'app-sustancias',
  standalone: true, 
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule,MatAutocompleteModule,
    RouterLink, MatButtonModule, CdkScrollable,MatFormField, ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,MatSelectModule,MatSlideToggleModule,
    MatCheckboxModule, MatProgressSpinnerModule,MatSnackBarModule,FuseVerticalNavigationComponent,
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

        gruposusts: any[] = [];     
        gruposControl = new FormControl();
        gruposFiltrados$: Observable<any[]>;    

        signInForm: FormGroup; 
        editGrupoForm: FormGroup;                                   

        constructor(
          private _sustanciaService: SustanciaService,
          private _gruposustService: GruposustService,
          private _formBuilder: FormBuilder,
          private _snackBar: MatSnackBar,
        ) { }

        ngOnInit(): void {

          this.loadSustancias();

          this.signInForm = this._formBuilder.group({
            name     : ['', [Validators.required]], 
            subpartida     : ['', [Validators.required]], 
            pao     : ['', [Validators.required]], 
            pcg     : ['', [Validators.required]], 
            grupo_sust: ['', Validators.required],                  
            activo: [false],
            cupo_prod: [false],    
          });

          this._gruposustService.getGruposustsActivo().subscribe((data: any[]) => {
            this.gruposusts = data;
          });

          this.gruposFiltrados$ = this.gruposControl.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.gruposusts.slice())
          );

          this.editGrupoForm = this._formBuilder.group({              
            //importado_id: ['', Validators.required],
            name: ['', Validators.required],
            subpartida: ['', Validators.required],
            pao: ['', Validators.required],
            pcg: ['', Validators.required],  
            grupo_sust: ['', Validators.required],
            activo: ['', Validators.required],              
          });

            }

            private _filter(name: string): any[] {
              if (!name) {
                return this.gruposusts.slice();
              }
              const filterValue = name.toLowerCase();
              return this.gruposusts.filter(option => option.name.toLowerCase().includes(filterValue));
            }

            openSnackBar(message: string, action: string) {
              this._snackBar.open(message, action, {
                duration: 2000, // Duración de la notificación
                horizontalPosition: 'center', // Posición horizontal
                verticalPosition: 'top', // Posición vertical
              });
            }

            onGrupoSelected(event: MatAutocompleteSelectedEvent) {
              if (event?.option?.value) {                
                this.signInForm.get('grupo_sust').setValue(event.option.value);
              } else {                
                console.error('El evento o la opción seleccionada son indefinidos');
              }
            }

            // Esta función se activa cuando se cambia el estado del checkbox de 'activo'
            onActivoChange(event: MatSlideToggleChange, sustancia: Sustancia): void {
              sustancia.activo = event.checked;
            }

            onCupoProdChange(event: MatSlideToggleChange, sustancia: Sustancia): void {
              sustancia.cupo_prod = event.checked;            
            }

            addSustancia(): void {
              

              if (!this.signInForm.valid) {
                this.openSnackBar('Por favor complete el formulario correctamente.', 'Error');
                return;
              } 
              
              const name = this.signInForm.get('name').value;
              const subpartida = this.signInForm.get('subpartida').value;
              const pao = this.signInForm.get('pao').value;
              const pcg = this.signInForm.get('pcg').value;
              const grupo_sust = this.signInForm.get('grupo_sust').value;              

              const nameExists = this.sustancias.some(sust => sust.name === name.trim());
              if (nameExists) {
                this.openSnackBar('La sustancia ya existe.', 'Error');
                return;
              }    
            
              // Crear un nuevo objeto Anio con el nombre y el estado activo
              const newSustancia: Sustancia = {                
                name: name.trim(),
                subpartida: subpartida.trim(),
                pao: pao.trim(),
                pcg: pcg.trim(),
                grupo_sust: grupo_sust,
                activo: this.signInForm.get('activo').value,
                cupo_prod: this.signInForm.get('cupo_prod').value
              };

              // Si todo está bien, procede a agregar la sustancia
              this._sustanciaService.addSustancia(newSustancia).subscribe({
                next: () => {
                  this.openSnackBar('Sustancia agregada exitosamente.', 'Success');                  
                  this.signInForm.reset();
                  this.loadSustancias();                  
                },
                error: (error) => {
                  console.error('Error al agregar el cupo', error);
                  this.openSnackBar('Error al agregar el cupo. Por favor intente nuevamente.', 'Error');    
                }
              });
            }

              selectSustanciaForEdit(sustancia: Sustancia): void {
                this.selectedSustancia = { ...sustancia };  
                
                this.gruposControl.setValue(sustancia.grupo_sust);
                
                this.gruposFiltrados$ = this.gruposControl.valueChanges.pipe(
                  startWith(''), // Inicia con el valor actual
                  map(value => this._filter(value || '')) // Filtra los países basado en la entrada del usuario
                );
                  
                this.editGrupoForm.setValue({
                  name: sustancia.name,
                  subpartida: sustancia.subpartida,
                  pao: sustancia.pao,
                  pcg: sustancia.pcg,
                  grupo_sust: sustancia.grupo_sust,
                  activo: sustancia.activo
                });
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
                this.selectedSustancia = null;
                this.searchTerm = '';
                this.applyFilter();
              }
}