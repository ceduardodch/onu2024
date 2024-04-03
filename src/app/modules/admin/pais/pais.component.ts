import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Pais } from './pais.model'; // Import the 'pais' class from the appropriate file
import { PaisService } from './pais.service';


@Component({
  selector: 'app-paises',
  standalone: true,
  imports        : [
    NgIf, NgFor, NgTemplateOutlet, NgClass, MatDivider,
    AsyncPipe, CurrencyPipe,FormsModule,MatIconModule, 
    RouterLink, MatButtonModule, CdkScrollable,
    MatFormField,ReactiveFormsModule
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

        constructor(private _paisService: PaisService) { }

            ngOnInit(): void {

            this.loadPaises();

            }

            addPais(): void {
              this._paisService.addPais(this.newPais).subscribe({
                next: () => {
                  this.loadPaises();
                  this.newPais = { id: 0, name: '' }; // Restablece el objeto `newPais`
                },
                error: (error) => {
                  console.error('Error al agregar el país', error);
                }
              });
            }

              selectPaisForEdit(pais: Pais): void {
                this.selectedPais = { ...pais };               
              }
            
              updatePais(updatedPais: Pais): void {
                if (!updatedPais.id) {
                  console.error('Error al actualizar: ID de país no proporcionado');
                  return;
                }
                this._paisService.updatePais(updatedPais.id, updatedPais).subscribe({
                  next: (response) => {
                    // Actualizar la lista de países en el frontend
                    const index = this.paises.findIndex(pais => pais.id === updatedPais.id);
                    if (index !== -1) {
                      this.paises[index] = updatedPais;
                    }
                    console.log('País actualizado:', response);
                    this.selectedPais = null; // Resetea la selección para cerrar el formulario de edición
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
                  },
                  error: (error) => console.error(error)
                });
              }

              searchPaises(): void {
                this.filteredPaises = this.searchTerm
                  ? this.paises.filter(pais => pais.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
                  : this.paises;
              }
            
              cancelEdit(): void {
                this.selectedPais = null;
                this.searchTerm = '';
              }
}