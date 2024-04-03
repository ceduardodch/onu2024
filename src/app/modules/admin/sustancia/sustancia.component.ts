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
import { Sustancia } from './sustancia.model'; // Import the 'User' class from the appropriate file
import { SustanciaService } from './sustancia.service';

@Component({
  selector: 'app-sustancias',
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
  templateUrl: './sustancia.component.html',
  styleUrl: './sustancia.component.scss'
})
export class SustanciasComponent implements OnInit{
        sustancias: Sustancia[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newSustancia:Sustancia = {
          id:0, name: '', subpartida: '',pao:'', pcg: '', grupos_sust: '',activo:'', cupo_prod: '', created_at: '',updated_at: ''};
        filteredSustancias: Sustancia[] = [];
        searchTerm: string = '';
        selectedSustancia:  Sustancia | null = null;

        constructor(private _sustanciaService: SustanciaService) { }

        ngOnInit(): void {

          this.loadSustancias();

            }

            addSustancia(): void {
              this._sustanciaService.addSustancia(this.newSustancia).subscribe({
                next: () => {
                  this.loadSustancias();
                  this.newSustancia = { id: 0, name: '' , subpartida: '',pao:'', pcg: '', grupos_sust: '',activo:'', cupo_prod: '', created_at: '',updated_at: ''}; // Restablece el objeto `newSustancia`
                },
                error: (error) => {
                  console.error('Error al agregar la sustancia', error);
                }
              });
            }

              selectSustanciaForEdit(sustancia: Sustancia): void {
                this.selectedSustancia = { ...sustancia };               
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
                  },
                  error: (error) => console.error(error)
                });
              }

              searchSustancias(): void {
                this.filteredSustancias = this.searchTerm
                  ? this.sustancias.filter(sustancia => sustancia.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
                  : this.sustancias;
              }
            
              cancelEdit(): void {
                this.selectedSustancia = null;
                this.searchTerm = '';
              }
}