import { Routes } from '@angular/router';
import { ImportacionListComponent } from 'app/modules/admin/example/importacion/importacion.component';
import { inject } from '@angular/core';
import { ImportacionService } from '../../admin/service/importacion.service';
import { CrearImportacionComponent } from 'app/modules/admin/example/crear-importacion/crear-importacion.component';
export default [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'importacion',
    },
    {
        path     : '',
        component: ImportacionListComponent,
        children : [
            {
                path     : 'importacion',
                component: ImportacionListComponent,
                resolve  : {
                    imports  : () => inject(ImportacionService).getImportaciones(),
                },
            },

        ],
    },
    {
        path: 'crear-importacion',
        component: CrearImportacionComponent,
        children : [

        ],
    }
] as Routes;
