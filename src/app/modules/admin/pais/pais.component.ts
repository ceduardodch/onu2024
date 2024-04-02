import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pais } from './pais.model'; // Import the 'pais' class from the appropriate file
import { PaisService } from './pais.service';


@Component({
  selector: 'app-paises',
  standalone: true,
  imports        : [NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe,FormsModule],
  templateUrl: './pais.component.html',
  styleUrl: './pais.component.scss'
})
export class PaisesComponent implements OnInit{
        paises: Pais[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newPais:Pais = {name: ''};
        selectedPais:  Pais | null = null;

        constructor(private _paisService: PaisService) { }

        ngOnInit(): void {

            this._paisService.getPaises().subscribe((paises: Pais[]) => {
                this.paises = (paises);
            });
            }

            addPais(): void {
                console.log();
                this._paisService.addPais(this.newPais).subscribe((pais: Pais) => {
                  this.paises.push(pais);                 
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

              loadPaises(): void {
                this._paisService.getPaises().subscribe({
                  next: (data) => this.paises = data,
                  error: (error) => console.error(error)
                });
              }
            
              cancelEdit(): void {
                this.selectedPais = null;
              }
}