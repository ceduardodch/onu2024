import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router'; // Import Router
import { Importacion } from './importacion.model'; // Import the 'User' class from the appropriate file
import { ImportacionService } from './importacion.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports        : [NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe,FormsModule, MatToolbarModule, MatIcon],
  templateUrl: './importacion.component.html',
  styleUrl: './importacion.component.scss'
})
export class ImportacionComponent implements OnInit{
    importaciones: any[];
    searchTerm: string = '';


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
                    this.router.navigate(['/crear-importacion',0]);

            }

            editImportacion(id: number): void
            {
                this.router.navigate(['/crear-importacion',id]);
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
            aproveImportacion(id: number): void {
                const confirmation = confirm('¿Estás seguro de que deseas aprobar el registro?');
                if (!confirmation) {
                  return;
                }
                this._importacionService.aproveImportacion(id).subscribe((data: any) => {
                    this.loadImportaciones();
                });
            }
            applyFilter(): void {
                this._importacionService.getImportacion().subscribe((data: any) => {
                  this.importaciones = data.filter((importacion: Importacion) => importacion.importador.toLowerCase().includes(this.searchTerm.toLowerCase()));
                });
              }

}

