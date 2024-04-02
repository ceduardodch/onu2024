import { Routes } from '@angular/router';
import { ProveedorsComponent } from './proveedor.component';
//
const routes: Routes = [
    {
        path: '', // quita la barra al principio
        component: ProveedorsComponent,
    },
];

export default routes;
