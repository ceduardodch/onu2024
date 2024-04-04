import { Component,OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ImportacionService } from './importacion.service';
import { FormsModule } from '@angular/forms';
import { Importacion } from './importacion.model'; // Import the 'User' class from the appropriate file
import { Observable, of } from 'rxjs'; // Import the 'Observable' class from the appropriate package
import { Router } from '@angular/router'; // Import Router


@Component({
  selector: 'app-users',
  standalone: true,
  imports        : [NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe,FormsModule],
  templateUrl: './importacion.component.html',
  styleUrl: './importacion.component.scss'
})
export class ImportacionComponent implements OnInit{
    importaciones: any[];


        constructor(private _importacionService: ImportacionService,       private router: Router,) { }

        ngOnInit(): void {
            this._importacionService.getImportacion().subscribe((data: any) => {
                this.importaciones = data;
            });
            }
            createImportacion(): void
            {
                    this.router.navigate(['/crear-importacion']);

            }

}

function subscribe(arg0: (importacion: Importacion) => void) {
    throw new Error('Function not implemented.');
}


