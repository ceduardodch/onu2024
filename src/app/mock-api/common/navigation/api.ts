import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { compactNavigation, defaultNavigation,importadorNavigation, futuristicNavigation, horizontalNavigation } from 'app/mock-api/common/navigation/data';
import { cloneDeep } from 'lodash-es';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Injectable({providedIn: 'root'})
export class NavigationMockApi
{
    private readonly _compactNavigation: FuseNavigationItem[] = compactNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _importadorNavigation: FuseNavigationItem[] = importadorNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] = futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] = horizontalNavigation;
    user: User;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService,
        private _userService: UserService)

    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() =>
            {
                // Fill compact navigation children using the default navigation
                this._compactNavigation.forEach((compactNavItem) =>
                {
                    this._defaultNavigation.forEach((defaultNavItem) =>
                    {
                        if ( defaultNavItem.id === compactNavItem.id )
                        {
                            compactNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fill futuristic navigation children using the default navigation
                this._futuristicNavigation.forEach((futuristicNavItem) =>
                {
                    this._defaultNavigation.forEach((defaultNavItem) =>
                    {
                        if ( defaultNavItem.id === futuristicNavItem.id )
                        {
                            futuristicNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fill horizontal navigation children using the default navigation
                this._horizontalNavigation.forEach((horizontalNavItem) =>
                {
                    this._defaultNavigation.forEach((defaultNavItem) =>
                    {
                        if ( defaultNavItem.id === horizontalNavItem.id )
                        {
                            horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Aquí, obtén el tipo de usuario actual
                this._userService.user$.subscribe(user => {
                    this.user = user;
                });
                if (!this.user) {
                    this._userService.get().subscribe();
                }

                // Luego, selecciona la navegación basada en el tipo de usuario
                let selectedNavigation;
                switch (this.user.tipo_usr) {
                    case 'admin':
                        selectedNavigation = this._defaultNavigation;
                        break;
                    case 'importador':
                        selectedNavigation = this._importadorNavigation;
                        break;
                    // Agrega más casos si tienes más tipos de usuario
                    default:
                        selectedNavigation = this._defaultNavigation;
                }

                // Return the response
                return [
                    200,
                    {
                        compact   : cloneDeep(this._compactNavigation),
                        default   : cloneDeep(selectedNavigation),
                        futuristic: cloneDeep(this._futuristicNavigation),
                        horizontal: cloneDeep(this._horizontalNavigation),
                    },
                ];
            });
    }
}
