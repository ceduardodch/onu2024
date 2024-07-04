import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet , CommonModule} from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Importacion } from './importacion.model';
import { ImportacionService } from './importacion.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatHeaderRowDef, MatRowDef, MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Sort, MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-importacion',
  standalone: true,

  imports: [CommonModule, NgIf, NgFor, NgTemplateOutlet,
    NgClass, AsyncPipe, CurrencyPipe, FormsModule, MatToolbarModule,
    MatIcon, MatPaginator, MatSort, MatTable, MatHeaderRowDef, MatRowDef, MatTableModule, MatSortModule],
  templateUrl: './importacion.component.html',
  styleUrls: ['./importacion.component.scss']
})
export class ImportacionComponent implements OnInit {

  importaciones: Importacion[] = [];
  searchTerm: string = '';
  columnsToDisplay: string[] = [
    // 'id',
    'solicitud_date',
    'authorization_date',
    'vue',
    'month',
    'importador',
    // 'proveedor',
    // 'country',
    'status',
    'grupo',
    'acciones'
  ];
  dataSource: MatTableDataSource<Importacion>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _importacionService: ImportacionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadImportaciones();
  }

  loadImportaciones(): void {
    this._importacionService.getImportacion().subscribe((data: Importacion[]) => {
      this.importaciones = data.map(elem => {
        const authorization_date = new Date(Date.parse(elem.authorization_date));
        const solicitud_date = new Date(Date.parse(elem.solicitud_date));

        elem.authorization_date = authorization_date.toLocaleDateString('es-EC');
        elem.solicitud_date = solicitud_date.toLocaleDateString('es-EC');
        return elem;
      });
      this.dataSource = new MatTableDataSource(this.importaciones);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.sortingDataAccessor = (item, property) => {return item[property]};
    });
  }

  createImportacion(): void {
    this.router.navigate(['/crear-importacion', 0]);
  }

  editImportacion(id: number): void {
    this.router.navigate(['/crear-importacion', id]);
  }

  deleteImportacion(id: number): void {
    const confirmation = confirm('¿Estás seguro de que deseas eliminar el registro?');
    if (!confirmation) {
      return;
    }
    this._importacionService.deleteImportacion(id).subscribe(() => {
      this.loadImportaciones();
      // this.importaciones = this.importaciones.filter(importacion => importacion.id !== id.toString());
    });
  }

  aproveImportacion(id: number): void {
    const confirmation = confirm('¿Estás seguro de que deseas aprobar el registro?');
    if (!confirmation) {
      return;
    }
    this._importacionService.aproveImportacion(id).subscribe(() => {
      this.loadImportaciones();
    });
  }

  applyFilter(): void {
    this._importacionService.getImportacion().subscribe((data: Importacion[]) => {
      this.importaciones = data.filter(importacion => importacion.importador.toLowerCase().includes(this.searchTerm.toLowerCase()));
      this.dataSource = new MatTableDataSource(this.importaciones);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngOnChanges() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

}
