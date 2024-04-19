import { AsyncPipe, CommonModule, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AnioService } from '../../anio/anio.service';
import { CupoService } from '../../cupo/cupo.service';
import { ImportadorService } from '../../importador/importador.service';
import { PaisService } from '../../pais/pais.service';
import { ProveedorService } from '../../proveedor/proveedor.service';
import { DetalleProductosComponent } from '../detalle-productos/detalle-productos.component';
import { ImportacionService } from '../importacion.service';

@Component({
  selector: 'app-crear-importacion',
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
    templateUrl: './crear-importacion.component.html',
  styleUrl: './crear-importacion.component.scss'
})


export class CrearImportacionComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

    selectedButton: string = '';    
    
    displayedColumns: string[] = ['producto', 'subpartida', 'cif', 'kg', 'fob','eq','eliminar'];
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
    dataSource: any[];
    currentStep = 'Borrador';
    currentType: any;
    selectedFileName: any;

    anios = [];
    cupos = [];
    importacion :any;    

    selectedProveedor: string;
    selectedImportador: string;
    selectedPais: string;

    importadores: any[] = [];
    importadorControl = new FormControl();
    importadoresFiltrados$: Observable<any[]>; 

    proveedores: any[] = [];
    proveedoresControl = new FormControl();
    proveedoresFiltrados$: Observable<any[]>; 

    countrys: any[] = [];
    paisControl = new FormControl();
    paisesFiltrados$: Observable<any[]>;

    signInForm: FormGroup;

    constructor(private _proveedorService: ProveedorService,
                private _anioService: AnioService,
                private _paisService: PaisService,
                private _importadorService: ImportadorService,
                private _cupoService: CupoService,
                private cdr: ChangeDetectorRef,
                private _importacionService: ImportacionService,
                private route: ActivatedRoute,
                        public dialog: MatDialog,

                private _formBuilder: FormBuilder,
                private _snackBar: MatSnackBar,

               ) {}


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
                this.fechaAutorizacion = new Date(data[0].authorization_date);
                this.fechaSolicitud = new Date(data[0].solicitud_date);
                this.anios = [{name: data[0].years}];
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
                    this.selectedFileName = data.name;
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

        this.signInForm = this._formBuilder.group({                                     
          importador : ['', [Validators.required]],
          proveedor: ['', [Validators.required]],
          pais: ['', [Validators.required]],
        });

        this._importadorService.getImportadors().subscribe((data: any[]) => {
          this.importadores = data;
        });

        this.importadoresFiltrados$ = this.importadorControl.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : this.importadores.slice())
        );    

        this._proveedorService.getProveedors().subscribe((data: any[]) => {
          this.proveedores = data;
        });

        this.proveedoresFiltrados$ = this.proveedoresControl.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter2(name) : this.proveedores.slice())
        );    

        this._paisService.getPaises().subscribe((data: any[]) => {
          this.countrys = data || [];
        });

        this.paisesFiltrados$ = this.paisControl.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter3(name) : this.countrys.slice())
        );

      }

      private _filter(name: string): any[] {
        if (!name) {
          return this.importadores.slice();
        }
        const filterValue = name.toLowerCase();
        return this.importadores.filter(option => option.name.toLowerCase().includes(filterValue));
      }

      private _filter2(name: string): any[] {
        if (!name) {
          return this.proveedores.slice();
        }
        const filterValue = name.toLowerCase();
        return this.proveedores.filter(option => option.name.toLowerCase().includes(filterValue));
      }

      private _filter3(name: string): any[] {
        if (!name) {
          return this.countrys.slice();
        }
        const filterValue = name.toLowerCase();
        return this.countrys.filter(option => option.name.toLowerCase().includes(filterValue));
      }

      async loadData() {
          /*
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
          );*/

          this._anioService.getAniosActivo().subscribe((data: any[]) => {
              this.anios = data;
              }
          );

      }
      /*selectFile(event) {
        this.selectedFile = event.target.files[0];
        this.selectedFileName = event.target.files[0].name;
      }

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
        //this.form.patchValue({ ficha: file });
      }*/

      selectFile(event: Event): void {
        const element = event.target as HTMLInputElement;
        const file = element.files && element.files[0] ? element.files[0] : null;
        
        if (file) {
          this.selectedFile = file;
          this.selectedFileName = file.name;          
        }
      }
      

      openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: 2000, // Duración de la notificación
          horizontalPosition: 'center', // Posición horizontal
          verticalPosition: 'top', // Posición vertical
        });
      }

    onImportadorSelected(event) {
        //console.log('onImportadorSelected',event);
    this.calculoResumen(event);
    if (event?.option?.value) {                
      this.signInForm.get('importador').setValue(event.option.value);
    } else {                
      console.error('El evento o la opción seleccionada son indefinidos');
    }
    }

    onProveedorSelected(event) {
      //console.log('onImpSelected',event);
    this.calculoResumen(event);
    if (event?.option?.value) {                
    this.signInForm.get('proveedor').setValue(event.option.value);
    } else {                
    console.error('El evento o la opción seleccionada son indefinidos');
    }
    }

    //onPaisSelected(event: MatAutocompleteSelectedEvent) {
    onPaisSelected(event) {
      if (event?.option?.value) {                
        this.signInForm.get('pais').setValue(event.option.value);
      } else {                
        console.error('El evento o la opción seleccionada son indefinidos');
      }
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

        const importo_n = this.signInForm.get('importador').value;
        const prove_n = this.signInForm.get('proveedor').value;
        const pais_n = this.signInForm.get('pais').value;

        let nombreDelMes = this.nombresDeMeses[this.fechaAutorizacion.getMonth()];
        console.log('Paso1 Save', this.selectedFile);

                let body = {
                    "authorization_date": this.fechaAutorizacion,
                    "solicitud_date": this.fechaSolicitud,
                    "month": nombreDelMes,
                    "cupo_asignado": this.cupoAsignado,
                    "status": this.currentStep,
                    "cupo_restante": this.cupoRestante,
                    "total_solicitud": this.totalPao,
                    "total_pesokg": this.totalPesoKg,
                    "vue": this.nroSolicitudVUE.value,
                    "data_file": (mainFileReader.result as string).split(',')[1],
                    "importador": importo_n,
                    "importador_id": this.importadorControl.value.id,
                    "years": this.anios[0]?.name,
                    "pais": pais_n,
                    "proveedor": prove_n,
                    "grupo": 'prueba',//cambiar aquiiiii
                    "details": this.listaProductos.map((producto, index) => ({
                        cif: producto.cif,
                        fob: producto.fob,
                        peso_kg: producto.kg,
                        pao: producto.pao,
                        sustancia: producto.producto,
                        subpartida: producto.subpartida,
                        ficha_id: producto.ficha_id
                    }))
                };
                console.log(body);

                this._importacionService.addImportacion(body).subscribe({
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




    eliminarProducto(productoEliminar) {

      this.listaProductos = this.listaProductos.filter(producto => producto !== productoEliminar);
      this.dataSource = [...this.listaProductos]; // Actualiza el dataSource de la tabla

      this.cdr.detectChanges();
    }
    /*
    private _filtrarImportadores(value: string): any[] {
      const filterValue = value.toLowerCase();
      // Filtrar el arreglo de importadores
      return this.importadores.filter(importador =>
        importador.name.toLowerCase().includes(filterValue)
      );
    }*/

}
