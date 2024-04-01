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
        newPais:Pais = {id:0, name: '', created_at: '',updated_at: ''};


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
  editPais(pais) {
    // Aquí va tu código para editar el usuario
  }
}

function subscribe(arg0: (pais: Pais) => void) {
    throw new Error('Function not implemented.');
}

