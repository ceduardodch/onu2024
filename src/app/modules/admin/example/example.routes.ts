import { Routes } from '@angular/router';
import { ImportacionListComponent } from 'app/modules/admin/example/importacion/importacion.component';
import { inject } from '@angular/core';
import { ImportacionService } from '../../admin/service/importacion.service';
export default [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'importacion',
    },
    {
        path     : 'importacion',
        component: ImportacionListComponent,
        children : [
            {
                path     : '',
                component: ImportacionListComponent,
                resolve  : {

                    imports  : () => inject(ImportacionService).getImportaciones(),

                },
            },
        ],
    },
] as Routes;
