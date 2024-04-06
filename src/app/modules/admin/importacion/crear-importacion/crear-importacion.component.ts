import { AsyncPipe, CommonModule, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnioService } from '../../anio/anio.service';
import { CupoService } from '../../cupo/cupo.service';
import { ImportadorService } from '../../importador/importador.service';
import { PaisService } from '../../pais/pais.service';
import { ProveedorService } from '../../proveedor/proveedor.service';
import { DetalleProductosComponent } from '../detalle-productos/detalle-productos.component';
import { ImportacionService } from '../importacion.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crear-importacion',
  standalone: true,
  providers: [
    // otros proveedores aquí...
    { provide: MAT_DATE_LOCALE, useValue: 'es' }
  ],
  imports        : [
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule,
    MatButtonModule,
    CommonModule,MatDividerModule,NgIf,
    MatRadioModule, MatProgressBarModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule, FormsModule, MatTableModule,
    ReactiveFormsModule, MatButtonModule,
    MatSortModule, NgFor, NgTemplateOutlet,MatTooltipModule,
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
    displayedColumns: string[] = ['producto', 'subpartida', 'cif', 'kg', 'fob','eq','eliminar'];
    displayedColumnsFT: string[] = ['nombre', 'ficha'];
    listaProductos = []; // Añade esta línea
    fileUrl: string;
    fechaAutorizacion: Date = new Date();
    fechaSolicitud: Date;
    cupoAsignado:Number= 0.00;

    cupoRestante:Number=0.00;
    totalPao:Number= 0.00;
    totalPesoKg: Number= 0.00;
    paisSeleccionado: any;
    proveedorSeleccionado: string;
    nombresDeMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    grupoSustancia :string;
    nroSolicitudVUE = new FormControl('', [
        Validators.required,
        Validators.pattern('^\\d{19}P$')      ]);
        selectedFile: File;
    dataSource: any[];
    currentStep = 'Borrador';
    currentType: any;
    selectedFileName: any;
    anios = [];
    cupos = [];
    importacion :any;

    importadoresFiltrados: any[];

    constructor(private _proveedorService: ProveedorService,
                private _anioService: AnioService,
                private _paisService: PaisService,
                private _importadorService: ImportadorService,
                private _cupoService: CupoService,
                private _importacioService: ImportacionService,
                private cdr: ChangeDetectorRef,
                private _importacionService: ImportacionService,
                private route: ActivatedRoute,
                                public dialog: MatDialog

               ) {

                this.importadoresFiltrados = this.importadores;

                }


                ngAfterViewInit() {
                    Promise.resolve().then(() => {
                      this.cdr.detectChanges();
                    });
                  }
    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        console.log('id',id);
        //cargar data maestro detalle para editar importacion existente si id es diferente de null
        if (id) {
            this._importacionService.getImportacionById(Number(id)).subscribe((data: any) => {
                console.log('data',data);
                this.importadorControl.setValue(data.importador);
                this.fechaAutorizacion = new Date(data.authorization_date);
                this.cupoAsignado = data.cupo_asignado;
                this.cupoRestante = data.cupo_restante;
                this.totalPao = data.total_solicitud;
                this.totalPesoKg = data.total_pesokg;
                this.nroSolicitudVUE.setValue(data.vue);
                this.paisSeleccionado = data.pais;
                this.proveedorSeleccionado = data.proveedor;
                this.grupoSustancia = data.grupo;
                this.listaProductos = data.details;
                this.dataSource = this.listaProductos;
                this.currentStep = data.status;
                this.importacion = data;
                this.calculoResumen(data.importador);
            });
        }

        this.loadData().then(() => {
        });

        this.importadorControl.valueChanges
      .pipe(
        startWith(''),
        map(valor => this._filtrarImportadores(valor)),
      )
      .subscribe(filtrados => this.importadoresFiltrados = filtrados);

      }

      async loadData() {
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

          this._anioService.getAniosActivo().subscribe((data: any[]) => {
              this.anios = data;
              }
          );

      }
      selectFile(event) {
        this.selectedFile = event.target.files[0];
        this.selectedFileName = event.target.files[0].name;


      }
    onImportadorSelected(event) {
        console.log('onImportadorSelected',event);
    this.calculoResumen(event);
    }
    displayFn(importador: any): string {
        return importador && importador.name ? importador.name : '';
    }
    calculoResumen(event) {
    console.log('calculoResumen event',event);
        this._cupoService.getCuposByName(event.name).subscribe((data: any[]) => {
            this.cupos = data;
            console.log(data);
        });
        this._importacioService.getImportacionByImportador(event.name).subscribe((data: any[]) => {
            console.log(data);
            this.importacion = data;
        });
        let totalCIF = 0.00;
        let totalKg = 0.00;
        let totalFOB = 0.00;
        let totalPAO = 0.00;
        this.listaProductos.forEach((element) => {
            totalCIF += element.cif;
            totalKg += element.kg;
            totalFOB += element.fob;
            totalPAO += element.pao;
        });

        console.log('this.grupoSustancia',this.grupoSustancia);
        if (this.grupoSustancia === 'HCFC') {
            this.cupoAsignado = this.cupos[0].hfc;
        }
        if (this.grupoSustancia === 'HFC') {
            this.cupoAsignado =  this.cupos[0].hcfc;
        }



        this.totalPesoKg =totalKg ;
        this.cupoRestante = Number(this.cupoAsignado) - Number(this.importacion.total_solicitud)- Number(totalPAO);
        this.totalPao = totalPAO;


    }
      openDialog() {

        const dialogRef = this.dialog.open(DetalleProductosComponent, {
            width: '600px',
            height: '420px'
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.fileUrl= URL.createObjectURL(result.ficha);
                this.listaProductos = [...this.listaProductos, result];
                this.dataSource = this.listaProductos;

                this.grupoSustancia = result.grupo;
            this.calculoResumen(this.importadorControl.value);

          }
        });
      }
      onProveedorSeleccionado(event: MatSelectChange) {
        this.proveedorSeleccionado = event.value;
      }
      onPaisSeleccionado(event: MatSelectChange) {
        this.paisSeleccionado = event.value;
      }

      save() {
        let nombreDelMes = this.nombresDeMeses[this.fechaAutorizacion.getMonth()];
        console.log('Paso1 Save', this.selectedFile);

        // Preparar promesas para leer fichas como Data URL
        let fileReadPromises = this.listaProductos.map(producto => {
            return new Promise<string>((resolve, reject) => {
                let reader = new FileReader();
                reader.onload = () => {
                    // Convertir directamente a Base64 eliminando el prefijo Data URL
                    resolve((reader.result as string).split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(producto.ficha);
            });
        });
        Promise.all(fileReadPromises).then(fichas => {
            let mainFileReader = new FileReader();
            mainFileReader.onload = () => {
                let body = {
                    "authorization_date": this.fechaAutorizacion,
                    "month": nombreDelMes,
                    "cupo_asignado": this.cupoAsignado,
                    "status": this.currentStep,
                    "cupo_restante": this.cupoRestante,
                    "total_solicitud": this.totalPao,
                    "total_pesokg": this.totalPesoKg,
                    "vue": this.nroSolicitudVUE.value,
                    "data_file": (mainFileReader.result as string).split(',')[1],
                    "importador": this.importadorControl.value.name,
                    "importador_id": this.importadorControl.value.id,

                    "years": this.anios[0]?.name,
                    "pais": this.paisSeleccionado,
                    "proveedor": this.proveedorSeleccionado,
                    "grupo": this.grupoSustancia,
                    "details": this.listaProductos.map((producto, index) => ({
                        cif: producto.cif,
                        fob: producto.fob,
                        peso_kg: producto.kg,
                        pao: producto.pao,
                        sustancia: producto.producto,
                        subpartida: producto.subpartida,
                        ficha_file: fichas[index]
                    }))
                };
                console.log(body);

              this._importacioService.addImportacion(body).subscribe({
                  error: (error) => {
                      console.error('Error al agregar el importador', error);
                  }
              });
          };
          mainFileReader.readAsDataURL(this.selectedFile);
      }).catch(error => {
          console.error('Error al leer los archivos', error);
      });

      }

    eliminarProducto(productoEliminar) {

      this.listaProductos = this.listaProductos.filter(producto => producto !== productoEliminar);
      this.dataSource = [...this.listaProductos]; // Actualiza el dataSource de la tabla

      this.cdr.detectChanges();
    }

    private _filtrarImportadores(value: string): any[] {
      const filterValue = value.toLowerCase();
      // Filtrar el arreglo de importadores
      return this.importadores.filter(importador =>
        importador.name.toLowerCase().includes(filterValue)
      );
    }

}
