import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router'; // Import Router
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable, Subject, debounceTime, map, merge, switchMap, takeUntil } from 'rxjs';
import { InventoryLaExportacion, InventoryPagination } from '../../model/laexportacion.types';
import { LaExportacionService } from '../../service/laexportacion.service';
@Component({
    selector       : 'laexportacion-list',
    templateUrl    : './laexportacion.component.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 80px 80px 120px;

                @screen sm {
                    grid-template-columns: 80px 80px 80px 180px;
                }

                @screen md {
                    grid-template-columns: 80px 80px 80px 180px 220px;
                }

                @screen lg {
                    grid-template-columns: 80px 80px 80px 180px 220px 96px 72px;
                }
            }
        `,
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    imports        : [NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe],
})
export class LaExportacionListComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    laexportaciones$: Observable<InventoryLaExportacion[]>;


    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedImport: InventoryLaExportacion | null = null;
    selectedImportForm: UntypedFormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _importService: LaExportacionService,
        private router: Router,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the selected  form
        this.selectedImportForm = this._formBuilder.group({
            id               : [''],
            vue              : [''],
            importador       : [''],
            ano              : [''],

        });

        // Get the pagination
        this._importService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: InventoryPagination) =>
            {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the
        this.laexportaciones$ = this._importService.laexportaciones$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    console.log('query', query);
                    return this._importService.getLaExportaciones(0, 10, 'vue', 'asc', query);
                }),
                map(() =>
                {
                    this.isLoading = false;
                }),
            )
            .subscribe();
    }
    closeDetails(): void
    {
        this.selectedImport = null;
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'vue',
                start       : 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() =>
                {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get  if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._importService.getLaExportaciones(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() =>
                {
                    this.isLoading = false;
                }),
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle  details
     *
     * @param importId
     */
    toggleDetails(importId: string): void
    {
        // If the  is already selected...
        if ( this.selectedImport && this.selectedImport.id === importId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the  by id
        this._importService.getImportsById(importId)
            .subscribe((laexportacion) =>
            {
                // Set the selected
                this.selectedImport = laexportacion;

                // Fill the form
                this.selectedImportForm.patchValue(laexportacion);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Cycle through images of selected
     */
    cycleImages(forward: boolean = true): void
    {
        // Get the image count and current image index
        const count = this.selectedImportForm.get('images').value.length;
        const currentIndex = this.selectedImportForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if ( forward )
        {
            this.selectedImportForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else
        {
            this.selectedImportForm.get('currentImageIndex').setValue(prevIndex);
        }
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }



    /**
     * Create
     */
    createLaExportacion(): void
    {
            this.router.navigate(['/example/crear-laexportacion']);

    }

    /**
     * Update the selected  using the form data
     */
    updateSelectedLaExportacion(): void
    {
        // Get the  object
        const laexportacion = this.selectedImportForm.getRawValue();

        // Remove the currentImageIndex field
        delete laexportacion.currentImageIndex;

        // Update the  on the server
        this._importService.updateLaExportacion(laexportacion.id, laexportacion).subscribe(() =>
        {
            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected prouct using the form data
     */
    deleteSelectedLaExportacion(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete ',
            message: 'Are you sure you want to remove this ? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) =>
        {
            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                // Get the  object
                const laexportacion = this.selectedImportForm.getRawValue();

                // Delete the  on the server
                this._importService.deleteLaExportacion(laexportacion.id).subscribe(() =>
                {
                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() =>
        {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
