import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule , Validators} from '@angular/forms';
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
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SustanciaService } from '../../sustancia/sustancia.service';
import { MatDialog,MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-productos',
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
templateUrl: './detalle-productos.component.html',
  styleUrl: './detalle-productos.component.scss'
})
export class DetalleProductosComponent implements OnInit{
    productoControl = new FormControl();
    sustancias: any[];
    selectedFile: File;
    form = { producto: '', subpartida: '', cif: '', pao: '', fob: '', kg: ''};

    constructor(private _sustanciaService: SustanciaService,
        public dialogRef: MatDialogRef<DetalleProductosComponent>
        ) { }

    ngOnInit(): void {
        this._sustanciaService.getSustancias().subscribe((data) => {
        this.sustancias = data;
      });


    }

    selectFile(event) {
        this.selectedFile = event.target.files[0];
    }

    onSubmit() {
        // Recoge los datos del formulario
        const formData = this.form;
        console.log(formData);

        // Cierra el diálogo pasando los datos del formulario
        this.dialogRef.close(formData);
    }

}
