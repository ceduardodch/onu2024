import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
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
    RouterLink, MatButtonModule, CdkScrollable
  ],
  templateUrl: './importador.component.html',
  styleUrl: './importador.component.scss'
})
export class ImportadorsComponent implements OnInit{
        importadors: Importador[] = []; // Cambiado a array regular para manejar la lista de usuarios
        newImportador:Importador = {
          id:0, name: '', ruc: '',user_import:'', created_at: '',updated_at: ''};


        constructor(private _importadorService: ImportadorService) { }

        ngOnInit(): void {

            this._importadorService.getImportadors().subscribe((importadors: Importador[]) => {
                this.importadors = (importadors);
            });
            }

            addImportador(): void {
                console.log();
                this._importadorService.addImportador(this.newImportador).subscribe((importador: Importador) => {
                  this.importadors.push(importador);
                });
              }
  editImportador(importador) {
    // Aquí va tu código para editar el usuario
  }
}

function subscribe(arg0: (importador: Importador) => void) {
    throw new Error('Function not implemented.');
}

