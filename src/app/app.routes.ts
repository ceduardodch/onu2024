import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { CrearImportacionComponent } from './modules/admin/importacion/crear-importacion/crear-importacion.component';
import { CrearImportacionlComponent } from './modules/importadores/importacion/crear-importacionl/crear-importacionl.component';
export const appRoutes: Route[] = [
    {path: '', pathMatch : 'full', redirectTo: 'sign-in'},
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'imports'},
    {path: 'signed-in-redirect-importadores', pathMatch : 'full', redirectTo: 'importas'},


    {
        path: '',
        component: LayoutComponent,
        data: { layout: 'empty' },
        children: [
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
            {path: 'users', loadChildren: () => import('app/modules/admin/users/users.routes')},
            {path: 'paises', loadChildren: () => import('app/modules/admin/pais/pais.routes')},
            {path: 'anios', loadChildren: () => import('app/modules/admin/anio/anio.routes')},
            {path: 'cupos', loadChildren: () => import('app/modules/admin/cupo/cupo.routes')},
            {path: 'gruposusts', loadChildren: () => import('app/modules/admin/gruposust/gruposust.routes')},
            {path: 'proveedors', loadChildren: () => import('app/modules/admin/proveedor/proveedor.routes')},
            {path: 'sustancias', loadChildren: () => import('app/modules/admin/sustancia/sustancia.routes')},
            {path: 'importadors', loadChildren: () => import('app/modules/admin/importador/importador.routes')},
            {path: 'imports', loadChildren: () => import('app/modules/admin/importacion/importacion.routes')},
            {path: 'importas', loadChildren: () => import('app/modules/importadores/importacion/importacion.routes')},

            { path: 'crear-importacion/:id', component: CrearImportacionComponent },
            { path: 'crear-importacionl/:id', component: CrearImportacionlComponent }

        ]
    },
];
