import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule , Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule  } from '@angular/common';
import { ProveedorService } from '../../proveedor/proveedor.service';
import { PaisService } from '../../pais/pais.service';
import { ImportadorService } from '../../importador/importador.service';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
  selector: 'app-crear-importacion',
  standalone: true,

  imports        : [
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule,
    MatButtonModule,
    CommonModule,MatDividerModule,NgIf,
    MatRadioModule, MatProgressBarModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule, FormsModule, MatTableModule,
    ReactiveFormsModule, MatButtonModule,
    MatSortModule, NgFor, NgTemplateOutlet,
    MatPaginatorModule, NgClass, MatSlideToggleModule,MatToolbarModule,
    MatSelectModule, MatOptionModule, MatCheckboxModule,MatStepperModule,
    MatRippleModule, AsyncPipe, CurrencyPipe,MatAutocompleteModule],
    templateUrl: './crear-importacion.component.html',
  styleUrl: './crear-importacion.component.scss'
})


export class CrearImportacionComponent implements OnInit {
    selectedButton: string = '';
    proveedores: any[];
    paises: any[];
    importadores: any[];
    importadorControl = new FormControl();
    displayedColumns: string[] = ['producto', 'subpartida', 'cif', 'kg', 'fob','eq'];
    displayedColumnsFT: string[] = ['nombre', 'ficha'];
    nroSolicitudVUE = new FormControl('', [
        Validators.required,
        Validators.pattern('^\\d{19}P$')      ]);

    constructor(private _proveedorService: ProveedorService,
                private _paisService: PaisService,
                private _importadorService: ImportadorService) { }

    ngOnInit(): void {
        this._proveedorService.getProveedors().subscribe((data: any[]) => {
          this.proveedores = data;
        });
        this._paisService.getPaises().subscribe((data: any[]) => {
            this.paises = data;
            }
        );
        this._importadorService.getImportadors().subscribe((data: any[]) => {
            this.importadores = data;
            }
        );
      }

}
