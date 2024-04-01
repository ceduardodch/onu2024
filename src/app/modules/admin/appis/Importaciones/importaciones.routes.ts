import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ImportacionListComponent } from '../Importaciones/principal/admin/importacion.component';
import { ImportacionesComponent } from '../Importaciones/principal/importaciones.component';
import { ImportacionService } from '../Importaciones/principal/importaciones.service';

export default [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'importar',
    },
    {
        path     : 'importar',
        component: ImportacionesComponent,
        children : [
            {
                path     : '',
                component: ImportacionListComponent,
                resolve  : {
                    brands    : () => inject(ImportacionService).getBrands(),
                    categories: () => inject(ImportacionService).getCategories(),
                    products  : () => inject(ImportacionService).getProducts(),
                    tags      : () => inject(ImportacionService).getTags(),
                    vendors   : () => inject(ImportacionService).getVendors(),
                },
            },
        ],
    },
] as Routes;
