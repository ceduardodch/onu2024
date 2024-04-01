import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';

const routes: Routes = [
    {
        path: '', // quita la barra al principio
        component: UsersComponent,
    },
];

export default routes;
