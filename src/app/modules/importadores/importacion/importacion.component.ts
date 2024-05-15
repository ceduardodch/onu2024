import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router'; // Import Router
import { Importacion } from './importacion.model'; // Import the 'User' class from the appropriate file
import { ImportacionService } from './importacion.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Component({
  selector: 'app-users',
  standalone: true,
  imports        : [NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe,FormsModule, MatToolbarModule, MatIcon],
  templateUrl: './importacion.component.html',
  styleUrl: './importacion.component.scss'
})
export class ImportacionComponent implements OnInit{
    importaciones: any[];
    user: User;


        constructor(private _importacionService: ImportacionService,
                    private router: Router,
                    private _userService: UserService) { }

        ngOnInit(): void {
            this._userService.user$.subscribe(user => {
                this.user = user;
            });
            if (!this.user) {
                this._userService.get().subscribe();
            }

            this.loadImportaciones();
            }

            loadImportaciones(): void {
                this._importacionService.getImportacionByImportadores(this.user.id).subscribe((data: any) => {
                  this.importaciones = data;
                });
              }
            createImportacion(): void
            {
                    this.router.navigate(['/crear-importacion',0]);

            }

            editImportacion(id: number): void
            {
                this.router.navigate(['/crear-importacionl',id]);
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

}
function subscribe(arg0: (importacion: Importacion) => void) {
    throw new Error('Function not implemented.');
}
