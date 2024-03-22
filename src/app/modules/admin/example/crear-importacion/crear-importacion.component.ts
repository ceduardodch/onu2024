import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { fuseAnimations } from '@fuse/animations';

import { MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';


@Component({
    selector       : 'crear-importacion',
    templateUrl    : './crear-importacion.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    styleUrls: ['./crear-importacion.component.scss'],
    
    imports        : [
      MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule,
      MatButtonModule,
      CommonModule,MatDividerModule,NgIf,
      MatRadioModule, MatProgressBarModule, 
      MatFormFieldModule, MatIconModule, 
      MatInputModule, FormsModule, MatTableModule,
      ReactiveFormsModule, MatButtonModule, 
      MatSortModule, NgFor, NgTemplateOutlet, 
      MatPaginatorModule, NgClass, MatSlideToggleModule, 
      MatSelectModule, MatOptionModule, MatCheckboxModule, 
      MatRippleModule, AsyncPipe, CurrencyPipe],
    
})
export class CrearImportacionComponent {

  //envio de datos
    nombre: string;
    ruc: string;
    usuarioImportador: string;
    selectedButton: string = '';

  dataSource: any[]=[];
  displayedColumns: string[] = ['nombre', 'ruc', 'usuarioImportador'];
  pageSize: number = 10; // Tamaño de página predeterminado
  pageIndex: number = 0; // Índice de página predeterminado
  totalItems: number = this.dataSource.length; // Total de elementos
  pageEvent: PageEvent;
  

  constructor(public dialog: MatDialog) {
    // Simulación de datos cargados, reemplazar con datos reales
    this.dataSource = [
    { nombre: 'Importer 1', ruc: '123', usuarioImportador: 'User1' },
    { nombre: 'Importer 2', ruc: '456', usuarioImportador: 'User2' },
    { nombre: 'ABROADECUADOR', ruc: '2200235637001', usuarioImportador: 'ADHESIVOS' },
    { nombre: 'ABROADHESIVOS DEL ECUADOR', ruc: '2342342342342', usuarioImportador: 'aDEL ECUADOR' },
    { nombre: 'ABROADHESIVOS', ruc: '1791316347001', usuarioImportador: 'ABRO' },
    { nombre: 'ECUADOR', ruc: '1791316347001', usuarioImportador: 'ABRO' },
    { nombre: 'ABR ECUADOR', ruc: '17913101', usuarioImportador: 'L ECUADOR' },
    { nombre: 'DEL ECUADOR', ruc: '1791316347001', usuarioImportador: 'ABROADHESIVOS DEL ECUR' },
    { nombre: 'Importer 1', ruc: '123', usuarioImportador: 'User1' },
    { nombre: 'Importer 2', ruc: '456', usuarioImportador: 'User2' },
    { nombre: 'ABROADECUADOR', ruc: '2200235637001', usuarioImportador: 'ADHESIVOS' },
    { nombre: 'ABROADHESIVOS DEL ECUADOR', ruc: '2342342342342', usuarioImportador: 'aDEL ECUADOR' },
    { nombre: 'ABROADHESIVOS', ruc: '1791316347001', usuarioImportador: 'ABRO' },
    { nombre: 'ECUADOR', ruc: '1791316347001', usuarioImportador: 'ABRO' },
    { nombre: 'ABR ECUADOR', ruc: '17913101', usuarioImportador: 'L ECUADOR' },
    { nombre: 'DEL ECUADOR', ruc: '1791316347001', usuarioImportador: 'ABROADHESIVOS DEL ECUR' },
    { nombre: 'Importer 1', ruc: '123', usuarioImportador: 'User1' },
    { nombre: 'Importer 2', ruc: '456', usuarioImportador: 'User2' },
    { nombre: 'ABROADECUADOR', ruc: '2200235637001', usuarioImportador: 'ADHESIVOS' },
    { nombre: 'ABROADHESIVOS DEL ECUADOR', ruc: '2342342342342', usuarioImportador: 'aDEL ECUADOR' },
    { nombre: 'ABROADHESIVOS', ruc: '1791316347001', usuarioImportador: 'ABRO' },
    { nombre: 'ECUADOR', ruc: '1791316347001', usuarioImportador: 'ABRO' },
    { nombre: 'ABR ECUADOR', ruc: '17913101', usuarioImportador: 'L ECUADOR' },
    { nombre: 'DEL ECUADOR', ruc: '1791316347001', usuarioImportador: 'ABROADHESIVOS DEL ECUR' },
      
    ];
    this.totalItems = this.dataSource.length;
  }

  handlePage(event: any): void {
    this.pageEvent = event;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  
  }
  getPaginatedData(): any[] {
  const startIndex = this.pageIndex * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  return this.dataSource.slice(startIndex, endIndex);
  }

}
