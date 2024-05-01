import { Routes } from '@angular/router';
import { AniosComponent } from './anio.component';

const routes: Routes = [
    {
        path: '', // quita la barra al principio
        component: AniosComponent,
    },
];

export default routes;
