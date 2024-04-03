import { Routes } from '@angular/router';
import { ImportacionComponent } from './importacion.component';
//
const routes: Routes = [
    {
        path: '', // quita la barra al principio
        component: ImportacionComponent,
    },
];

export default routes;
