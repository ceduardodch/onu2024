import { Routes } from '@angular/router';
import { InventoryComponent } from 'app/modules/admin/inventory/inventory.component';
import { InventoryListComponent } from 'app/modules/admin/inventory/list/inventory.component';

export default [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'inventory',
    },
    {
        path     : 'inventory',
        component: InventoryComponent,
        children : [
            {
                path     : '',
                component: InventoryListComponent,
                resolve  : {
                    
                },
            },
        ],
    },
] as Routes;
