import { Routes } from '@angular/router';
import { SustanciasComponent } from './sustancia.component';
//
const routes: Routes = [
    {
        path: '', // quita la barra al principio
        component: SustanciasComponent,
    },
];

export default routes;
