import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router'; // Export RouterModule

@Component({
    selector     : 'exportacion',
    standalone   : true,
    templateUrl  : './example.component.html',
    imports: [RouterModule],

    encapsulation: ViewEncapsulation.None,
})
export class ExpComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
