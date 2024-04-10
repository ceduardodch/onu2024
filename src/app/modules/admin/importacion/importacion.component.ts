import { Component,OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ImportacionService } from './importacion.service';
import { FormsModule } from '@angular/forms';
import { Importacion } from './importacion.model'; // Import the 'User' class from the appropriate file
import { Observable, of } from 'rxjs'; // Import the 'Observable' class from the appropriate package
import { Router } from '@angular/router'; // Import Router
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-users',
  standalone: true,
  imports        : [NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe,FormsModule, MatToolbarModule, MatIcon],
  templateUrl: './importacion.component.html',
  styleUrl: './importacion.component.scss'
})
export class ImportacionComponent implements OnInit{
    importaciones: any[];


        constructor(private _importacionService: ImportacionService,       private router: Router,) { }

        ngOnInit(): void {
            this.loadImportaciones();
            }

            loadImportaciones(): void {
                this._importacionService.getImportacion().subscribe((data: any) => {
                  this.importaciones = data;
                });
              }
            createImportacion(): void
            {
                    this.router.navigate(['/crear-importacion']);

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
            }




            deleteImportacion(id: number): void {
                const confirmation = confirm('¿Estás seguro de que deseas eliminar el registro?');
                if (!confirmation) {
                  return;
                }
                this._importacionService.deleteImportacion(id).subscribe((data: any) => {
                    this.loadImportaciones();
                    this.importaciones = this.importaciones.filter((importacion: Importacion) => importacion.id !== id.toString());
                });
            }
}
function subscribe(arg0: (importacion: Importacion) => void) {
    throw new Error('Function not implemented.');
}


