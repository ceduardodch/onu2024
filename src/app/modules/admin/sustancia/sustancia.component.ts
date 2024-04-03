import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
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
    RouterLink, MatButtonModule, CdkScrollable
  ],
  templateUrl: './sustancia.component.html',
  styleUrl: './sustancia.component.scss'
})
export class SustanciasComponent implements OnInit{
        sustancias: Sustancia[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newSustancia:Sustancia = {
          id:0, name: '', subpartida: '',pao:'', pcg: '', grupos_sust: '',activo:'', cupo_prod: '', created_at: '',updated_at: ''};


        constructor(private _sustanciaService: SustanciaService) { }

        ngOnInit(): void {

            this._sustanciaService.getSustancias().subscribe((sustancias: Sustancia[]) => {
                this.sustancias = (sustancias);
            });
            }

            addSustancia(): void {
                console.log();
                this._sustanciaService.addSustancia(this.newSustancia).subscribe((sustancia: Sustancia) => {
                  this.sustancias.push(sustancia);
                });
              }
  editSustancia(sustancia) {
    // Aquí va tu código para editar el usuario
  }
}

function subscribe(arg0: (sustancia: Sustancia) => void) {
    throw new Error('Function not implemented.');
}

