import { AsyncPipe, CommonModule, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {  MatOptionModule, MatRippleModule } from '@angular/material/core';
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
import { forkJoin, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnioService } from '../../../admin/anio/anio.service';
import { CupoService } from '../../../admin/cupo/cupo.service';
import { ImportadorService } from '../../../admin/importador/importador.service';
import { PaisService } from '../../../admin/pais/pais.service';
import { ProveedorService } from '../../../admin/proveedor/proveedor.service';
import { DetalleProductosComponent } from '../detalle-productos/detalle-productos.component';
import { ImportacionService } from '../importacion.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-importacionl',
  standalone: true,
  providers: [
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
    templateUrl: './crear-importacionl.component.html',
  styleUrl: './crear-importacionl.component.scss'
})


export class CrearImportacionlComponent implements OnInit {
    selectedButton: string = '';
    proveedores: any[];
    paises: any[];
    importadores: any[];
    importadorControl = new FormControl();
    displayedColumns: string[] = ['producto', 'subpartida', 'cif', 'kg', 'fob','eq'];
    displayedColumnsFT: string[] = ['nombre', 'ficha'];
    listaProductos = []; // Añade esta línea
    fileUrl: string;

    fileDataUrl: string;
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
        Validators.pattern('^\\d{20}P$')      ]);
    selectedFile: File;
    selectedFile1: File;
    selectedFile2: File;

    dataSource: any[];
    currentStep = 'Borrador';
    currentType: any;
    selectedFileName: any;
    selectedFileName1: any;
    selectedFileName2: any;
    anios = [];
    cupos :any;
    importacion :any;
    idImportacion: any;
    status: any;

    importadoresFiltrados: any[];

    selectedProveedor: string;
    selectedImportador: string;
    selectedPais: string;
    fileDataId: Number;
    fileDataId1: Number;
    fileDataId2: Number;


    constructor(private _proveedorService: ProveedorService,
                private _anioService: AnioService,
                private _paisService: PaisService,
                private _importadorService: ImportadorService,
                private _cupoService: CupoService,
                private cdr: ChangeDetectorRef,
                private _importacionService: ImportacionService,
                private route: ActivatedRoute,
                public dialog: MatDialog,
                private router: Router

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
        if (id !== null && id !== '0') {
            this._importacionService.getImportacionById(Number(id)).subscribe((data: any) => {
              console.log('data',data);
              let dateParts = data[0].authorization_date.split("T")[0].split("-");
              let utcDate = new Date(Date.UTC(+dateParts[0], +dateParts[1] - 1, +dateParts[2]));
              this.fechaAutorizacion = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(), 12);
              console.log('data[0].authorization_date', this.fechaAutorizacion.toISOString().split('T')[0]);
              let datePartsS = data[0].solicitud_date.split("T")[0].split("-");
              let utcDateS = new Date(Date.UTC(+datePartsS[0], +datePartsS[1] - 1, +datePartsS[2]));
              this.fechaSolicitud = new Date(utcDateS.getUTCFullYear(), utcDateS.getUTCMonth(), utcDateS.getUTCDate(), 12);
              console.log('data[0].authorization_date', this.fechaSolicitud.toISOString().split('T')[0]);

              this.idImportacion = data[0].id;
                this.anios = [{name: data[0].years}];
                this.status = data[0].status;
                this.nroSolicitudVUE.setValue(data[0].vue);
                this.listaProductos = data[0].details;
                this.selectedProveedor = data[0].proveedor;
                this.selectedImportador = data[0].importador;
                this.selectedPais = data[0].country;
                this.cupoAsignado = data[0].cupo_asignado;
                this.cupoRestante = data[0].cupo_restante;
                this.totalPao = data[0].total_solicitud;
                this.totalPesoKg = data[0].total_pesokg;
                this._importacionService.downloadFile(data[0].data_file_id).subscribe((data: any) => {
                    console.log('File:', data);
                    this.selectedFileName = "Proforma.pdf";
                    this.fileDataUrl = data.file;
                });
                const requests = data[0].details.map(item => {
                    return this._importacionService.downloadFile(item.ficha_id).pipe(
                        map(fileData => ({
                            producto: item.sustancia,
                            subpartida: item.subpartida,
                            cif: item.cif,
                            kg: item.peso_kg,
                            fob: item.fob,
                            pao: item.peso_pao,
                            ficha_id: fileData.file
                        }))
                    );
                });
                forkJoin(requests).subscribe((products: any[]) => {
                    this.listaProductos = products;
                    console.log('Lista Productos:', this.listaProductos);
                    this.dataSource = this.listaProductos;
                });

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
        console.log('Event:', event);
        console.log('Files:', event.target.files);
        this.selectedFile = event.target.files[0];
        this.selectedFileName = event.target.files[0].name;
        console.log('Selected file:', this.selectedFile);

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
                this.fileDataId= response.file;
            }, error => {
                console.error('Error uploading file:', error);
            });
        };
        reader.readAsDataURL(this.selectedFile);
    }

    selectFile1(event) {
        console.log('Event:', event);
        console.log('Files:', event.target.files);
        this.selectedFile1 = event.target.files[0];
        this.selectedFileName1 = event.target.files[0].name;
        console.log('Selected file:', this.selectedFile1);

        const reader = new FileReader();
        reader.onload = () => {
            let base64File = reader.result as string;

            // Elimina el prefijo 'data:application/pdf;base64,' de la cadena
            const prefix = 'data:application/pdf;base64,';
            if (base64File.startsWith(prefix)) {
                base64File = base64File.substring(prefix.length);
            }

            this._importacionService.uploadFile(
                {'name': this.selectedFileName1, 'file': base64File}
            ).subscribe(response => {
                this.fileDataId1= response.file;
            }, error => {
                console.error('Error uploading file:', error);
            });
        };
        reader.readAsDataURL(this.selectedFile1);
    }

    selectFile2(event) {
        console.log('Event:', event);
        console.log('Files:', event.target.files);
        this.selectedFile2 = event.target.files[0];
        this.selectedFileName2 = event.target.files[0].name;
        console.log('Selected file:', this.selectedFile2);

        const reader = new FileReader();
        reader.onload = () => {
            let base64File = reader.result as string;

            // Elimina el prefijo 'data:application/pdf;base64,' de la cadena
            const prefix = 'data:application/pdf;base64,';
            if (base64File.startsWith(prefix)) {
                base64File = base64File.substring(prefix.length);
            }

            this._importacionService.uploadFile(
                {'name': this.selectedFileName2, 'file': base64File}
            ).subscribe(response => {
                this.fileDataId2= response.file;
            }, error => {
                console.error('Error uploading file:', error);
            });
        };
        reader.readAsDataURL(this.selectedFile2);
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
        this._cupoService.getCuposByName(event.id).subscribe((data: any[]) => {
            this.cupos = data;
            console.log(data);
        });
        this._importacionService.getImportacionByImportador(event.name).subscribe((data: any[]) => {
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
            this.cupoAsignado = this.cupos.hcfc;
        }
        else if (this.grupoSustancia === 'HFC') {
            this.cupoAsignado =  this.cupos.hfc;
        }
        else {
            this.cupoAsignado =  0;
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

      update() {

                let body = {
                    "id":this.idImportacion ,
                    "factura_file_it": this.fileDataId1,
                    "dai_file_id": this.fileDataId2,
                };
                console.log(body);

                this._importacionService.updateImportacion(body).subscribe({
                    next: (response) => {
                        console.log('Response received:', response);

                        alert('Importación agregada con éxito');
                        this.router.navigate(['/imports']);
                    },
                    error: (error) => {
                        console.error('Error al agregar el importadacion', error);
                    }
                });
          };



          aproveImportacion(): void {
            const confirmation = confirm('¿Estás seguro de que deseas aprobar el registro?');
            if (!confirmation) {
              return;
            }
            this._importacionService.aproveImportacion(this.idImportacion).subscribe((data: any) => {
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
