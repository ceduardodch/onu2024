import { Routes } from '@angular/router';
import { ImportacionComponent } from './importacion.component';
import { CrearImportacionComponent } from './crear-importacion/crear-importacion.component';
//
const routes: Routes = [
    {
        path: '', // quita la barra al principio
        component: ImportacionComponent,
    },
    { path: 'crear-importacion/:id', component: CrearImportacionComponent }
];

export default routes;
