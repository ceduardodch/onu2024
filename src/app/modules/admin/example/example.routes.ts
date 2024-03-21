import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CrearExportacionComponent } from 'app/modules/admin/example/crear-exportacion/crear-exportacion.component';
import { CrearLaExportacionComponent } from 'app/modules/admin/example/crear-exportacion/crear-laexportacion.component';
import { CrearImportacionComponent } from 'app/modules/admin/example/crear-importacion/crear-importacion.component';
import { ExportacionListComponent } from 'app/modules/admin/example/exportacion/exportacion.component';
import { LaExportacionListComponent } from 'app/modules/admin/example/exportacion/laexportacion.component';
import { ImportacionListComponent } from 'app/modules/admin/example/importacion/importacion.component';
import { ImportacionService } from '../../admin/service/importacion.service';
import { ExportacionService } from '../service/exportacion.service';
import { LaExportacionService } from '../service/laexportacion.service';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'importacion',
    },
    {
        path: '',
        component: ImportacionListComponent,
        children: [
            {
                path: 'importacion',
                component: ImportacionListComponent,
                resolve: {
                    imports: () => inject(ImportacionService).getImportaciones(),
                },
            },
        ],
    },
    {
        path: 'crear-importacion',
        component: CrearImportacionComponent,
        children: [],
    },

    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'exportacion',
    },
    {
        path: '',
        component: ExportacionListComponent,
        children: [
            {
                path: 'exportacion',
                component: ExportacionListComponent,
                resolve: {
                    imports: () => inject(ExportacionService).getExportaciones(),
                },
            },
        ],
    },
    {
        path: 'crear-exportacion',
        component: CrearExportacionComponent,
        children: [],
    },

    
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'laexportacion',
    },
    {
        path: '',
        component: LaExportacionListComponent,
        children: [
            {
                path: 'laexportacion',
                component: LaExportacionListComponent,
                resolve: {
                    imports: () => inject(LaExportacionService).getLaExportaciones(),
                },
            },
        ],
    },
    {
        path: 'crear-laexportacion',
        component: CrearLaExportacionComponent,
        children: [],
    }
];

export default routes;