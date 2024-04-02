import { Routes } from '@angular/router';
import { ImportadorsComponent } from './importador.component';
//
const routes: Routes = [
    {
        path: '', // quita la barra al principio
        component: ImportadorsComponent,
    },
];

export default routes;
