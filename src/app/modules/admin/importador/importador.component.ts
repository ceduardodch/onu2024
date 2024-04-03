import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Importador } from './importador.model'; // Import the 'User' class from the appropriate file
import { ImportadorService } from './importador.service';

@Component({
  selector: 'app-importadors',
  standalone: true,
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule, 
    RouterLink, MatButtonModule, CdkScrollable,MatFormField
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
          name: '', ruc: '',user_import:'', created_at: '',updated_at: ''};
        filteredImportadores: Importador[] = [];
        searchTerm: string = '';
        selectedImportador:  Importador | null = null;


        constructor(private _importadorService: ImportadorService) { }

        ngOnInit(): void {

          this.loadImportadores();

          }

          addImportador(): void {
            this._importadorService.addImportador(this.newImportador).subscribe({
              next: () => {
                this.loadImportadores();
                this.newImportador = { id: 0, name: '', ruc: '',user_import:'', created_at: '',updated_at: ''}; // Restablece el objeto `newImportador`
              },
              error: (error) => {
                console.error('Error al agregar el importador', error);
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
                },
                error: (error) => console.error(error)
              });
            }

            searchImportadores(): void {
              this.filteredImportadores = this.searchTerm
                ? this.importadors.filter(importador => importador.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
                : this.importadors;
            }
          
            cancelEdit(): void {
              this.selectedImportador = null;
              this.searchTerm = '';
            }
}