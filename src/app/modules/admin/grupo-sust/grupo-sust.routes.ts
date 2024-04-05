import { Routes } from '@angular/router';
import { Grupo_sustComponent } from './grupo-sust.component';

const routes: Routes = [
    {
        path: '', // quita la barra al principio
        component: Grupo_sustComponent,
    },
];

export default routes;
