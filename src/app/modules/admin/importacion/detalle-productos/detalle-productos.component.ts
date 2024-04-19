import { AsyncPipe, CommonModule, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
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
import { SustanciaService } from '../../sustancia/sustancia.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { startWith } from 'rxjs/operators';

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

export class DetalleProductosComponent implements OnInit {

    @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
    
    selectedFile: File;
    selectedFileName: string = '';    

    sustancias: any[] = [];
    productosControl = new FormControl();
    productosFiltrados$: Observable<any[]>;

    form: FormGroup;

    constructor(
        private _sustanciaService: SustanciaService,
        public dialogRef: MatDialogRef<DetalleProductosComponent>,

        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {

        this.form = this._formBuilder.group({

            producto: ['', Validators.required],
            subpartida: ['', Validators.required],
            grupo: ['', Validators.required],
            paoSustancia: [0, Validators.required],
            cif: ['', Validators.required],
            kg: ['', Validators.required],
            fob: ['', Validators.required],
            pao: [''],
            ficha: [null,Validators.required],
        });
        
        this._sustanciaService.getSustancias().subscribe((data) => {
            this.sustancias = data;
        });

        this.productosFiltrados$ = this.productosControl.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.sustancias.slice())
          );
    }

    private _filter(name: string): any[] {
        if (!name) {
          return this.sustancias.slice();
        }
        const filterValue = name.toLowerCase();
        return this.sustancias.filter(option => option.name.toLowerCase().includes(filterValue));
      }

      openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: 2000, // Duración de la notificación
          horizontalPosition: 'center', // Posición horizontal
          verticalPosition: 'top', // Posición vertical
        });
      }

    onProductSelected(sustancia) {
        this.form.patchValue({
            producto: sustancia.name,
            subpartida: sustancia.subpartida,
            grupo: sustancia.grupo_sust,
            paoSustancia: sustancia.pao || 0,

        });
    }

    /*selectFile(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const fileInput: HTMLElement = document.querySelector('#fileInput');
        fileInput.click();
        const file = (event.target as HTMLInputElement).files[0];
        if (file) {
            this.selectedFile = file;
            this.selectedFileName = file.name;
            this.form.patchValue({ ficha: file });            
        }
    }*/

    selectFile(event: Event): void {
        //event.preventDefault();
        //event.stopPropagation();

        const element = event.currentTarget as HTMLInputElement;
        let file: File | null = null;
        
        if (element.files && element.files[0]) {
          file = element.files[0];
        }
        this.selectedFile = file;
        this.selectedFileName = file.name;
        this.form.patchValue({ ficha: file });
      }

    onKgChange(value: string) {
        /*const result = Number(value) * this.form.value.paoSustancia;
        this.form.patchValue({ pao: result });
        */const kgValue = parseFloat(value);
        const paoSustanciaValue = parseFloat(this.form.value.paoSustancia);

        if (!isNaN(kgValue) && !isNaN(paoSustanciaValue)) {
        const result = kgValue * paoSustanciaValue;
        this.form.patchValue({ pao: result });
        } else {
        this.form.patchValue({ pao: 0 });
        }
    }
    onSubmit() {
        console.log(this.form.value);
        if (this.isDataComplete()) {

            const formData = this.form.value;
            console.log(formData);
            this.dialogRef.close(formData);
        }
         else {
            this.openSnackBar('Por favor, complete todos los campos requeridos.', 'Cerrar');
        }
    }
    isDataComplete(): boolean {
        return this.form.valid;

    }
}