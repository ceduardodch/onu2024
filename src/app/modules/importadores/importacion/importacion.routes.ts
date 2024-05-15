import { Routes } from '@angular/router';
import { ImportacionComponent } from './importacion.component';
import { CrearImportacionlComponent } from './crear-importacionl/crear-importacionl.component';
//
const routes: Routes = [
    {
        path: '', // quita la barra al principio
        component: ImportacionComponent,
    },
    { path: 'crear-importacionl/:id', component: CrearImportacionlComponent }
];

export default routes;
