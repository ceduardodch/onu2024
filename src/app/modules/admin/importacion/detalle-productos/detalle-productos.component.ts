import { AsyncPipe, CommonModule, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ImportacionService } from '../importacion.service';
import { Sustancia } from '../../sustancia/sustancia.model';
import { Observable, map, startWith } from 'rxjs';

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
    form: FormGroup;
    productoControl = new FormControl();
    filteredProductos: Observable<Sustancia[]>;
    selectedFile: File;
    selectedFileName: string;
    sustancias: any[];
    isLoading = false;
    constructor(
        private _sustanciaService: SustanciaService,
        private _importacionService: ImportacionService,
        public dialogRef: MatDialogRef<DetalleProductosComponent>
    ) {
        this.form = new FormGroup({
            producto: new FormControl('', Validators.required),
            subpartida: new FormControl('', Validators.required),
            grupo: new FormControl('', Validators.required),
            paoSustancia: new FormControl('', Validators.required),
            cif: new FormControl('', Validators.required),
            kg: new FormControl('', Validators.required),
            fob: new FormControl('', Validators.required),
            pao: new FormControl(''),
            pcgSustancia: new FormControl(''),
            ficha: new FormControl(''),
            ficha_id: new FormControl(''),

        });
    }

    ngOnInit(): void {
        this._sustanciaService.getSustancias().subscribe((data) => {
            this.sustancias = data;
            this.filteredProductos = this.productoControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterProductos(value))
            );
        });
    }
    private _filterProductos(value: string): Sustancia[] {
        const filterValue = value.toLowerCase();
        return this.sustancias.filter(producto => producto.name.toLowerCase().includes(filterValue));
    }
    onProductSelected(productoName: string) {
        const producto = this.sustancias.find(p => p.name === productoName);
        if (producto) {
            this.form.patchValue({
                producto: producto.name,
                subpartida: producto.subpartida,
                grupo: producto.grupo_sust,
                paoSustancia: producto.pao,
                pcgSustancia: producto.pcg
            });
        }
    }





    selectFile(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const fileInput: HTMLElement = document.querySelector('#fileInput');
        fileInput.click();
        const file = (event.target as HTMLInputElement).files[0];
        if (file) {
            this.isLoading = true;
            this.selectedFile = file;
            this.form.patchValue({ ficha: file });
            this.selectedFileName = file.name;

            const reader = new FileReader();
            reader.onload = () => {
                let base64File = reader.result as string;

                // Elimina el prefijo 'data:application/pdf;base64,' de la cadena
                const prefix = 'data:application/pdf;base64,';
                if (base64File.startsWith(prefix)) {
                    base64File = base64File.substring(prefix.length);
                }

                this._importacionService.uploadFile(
                    {'name': this.selectedFileName, 'file': base64File}
                ).subscribe(response => {
                    console.log('File uploaded:', response);
                    this.form.patchValue({ ficha_id: response.file });
                    this.isLoading = false;

                }, error => {
                    console.error('Error uploading file:', error);
                    this.isLoading = false;

                });
            };
            reader.readAsDataURL(this.selectedFile);


        }
    }

    onKgChange(value: string) {
        console.log(this.form.value);

        if (this.form.value.grupo === 'HFC') {
            const result = Number(value) * this.form.value.pcgSustancia/1000;
            this.form.patchValue({ pao: result });
        }
        else {
            const result = Number(value) * this.form.value.paoSustancia;
            this.form.patchValue({ pao: result });
        }

    }
    onSubmit() {
        console.log(this.form.value);
        if (this.isDataComplete()) {

            const formData = this.form.value;
            console.log(formData);
            this.dialogRef.close(formData);

    }
    }
    isDataComplete(): boolean {
        return this.form.valid;

    }
}
