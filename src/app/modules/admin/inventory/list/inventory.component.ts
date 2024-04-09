import { AsyncPipe, CommonModule, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fuseAnimations } from '@fuse/animations';

import { GruposustService } from '../../gruposust/gruposust.service';

@Component({
    selector       : 'inventory-list',
    templateUrl    : './inventory.component.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `,
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    imports        : [
        MatFormFieldModule, MatInputModule, MatDatepickerModule,
        CommonModule,MatDividerModule,NgIf,
        MatRadioModule, MatProgressBarModule,
        MatIconModule, FormsModule, MatTableModule,
        ReactiveFormsModule, MatButtonModule,
        MatSortModule, NgFor, NgTemplateOutlet,MatTooltipModule,
        MatPaginatorModule, NgClass, MatSlideToggleModule,MatToolbarModule,
        MatSelectModule, MatOptionModule, MatCheckboxModule,MatStepperModule,
        MatRippleModule, AsyncPipe, CurrencyPipe,MatAutocompleteModule
    ],
})
export class InventoryListComponent implements OnInit
{    
    selectedButton: string = '';
    gruposusts: any[];

    importadorControl = new FormControl();
    displayedColumns: string[] = ['Nombre', 'Subpartida', 'PAO', 'PCG', 'Activo','Cupo/prod'];
    //displayedColumnsFT: string[] = ['nombre', 'ficha'];
    listaProductos = []; // Añade esta línea
    selectedFile: File;
    dataSource: any[];
    displayedColumnsFT: string[] = ['nombre', 'ficha'];

    /**
     * Constructor
     */
    constructor(
        private _gruposustService: GruposustService,
        private cdr: ChangeDetectorRef,
        ) { }
        
        ngAfterViewInit() {
            Promise.resolve().then(() => {
              this.cdr.detectChanges();
            });
          }
ngOnInit(): void {
this._gruposustService.getGruposusts().subscribe((data: any[]) => {
  this.gruposusts = data;
});
}
selectFile(event) {
this.selectedFile = event.target.files[0];
}

openDialog() {


}
}
