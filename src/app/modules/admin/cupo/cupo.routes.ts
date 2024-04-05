import { Routes } from '@angular/router';
import { CuposComponent } from './cupo.component';

const routes: Routes = [
    {
        path: '', // quita la barra al principio
        component: CuposComponent,
    },
];

export default routes;
