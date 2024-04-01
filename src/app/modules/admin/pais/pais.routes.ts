import { Routes } from '@angular/router';
import { PaisesComponent } from './pais.component';

const routes: Routes = [
    {
        path: '', // quita la barra al principio
        component: PaisesComponent,
    },
];

export default routes;
