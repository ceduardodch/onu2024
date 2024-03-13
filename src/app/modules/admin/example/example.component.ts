import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
    selector     : 'example',
    standalone   : true,
    templateUrl  : './example.component.html',
    imports: [RouterModule],

    encapsulation: ViewEncapsulation.None,
})
export class ExampleComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
