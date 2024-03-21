import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { InventoryExportacion, InventoryPagination } from '../model/exportacion.types';

@Injectable({providedIn: 'root'})
export class ExportacionService
{
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> = new BehaviorSubject(null);
    private _exportacion: BehaviorSubject<InventoryExportacion | null> = new BehaviorSubject(null);
    private _exportaciones: BehaviorSubject<InventoryExportacion[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<InventoryPagination>
    {
        return this._pagination.asObservable();
    }


    get exportacion$(): Observable<InventoryExportacion>
    {
        return this._exportacion.asObservable();
    }


    get exportaciones$(): Observable<InventoryExportacion[]>
    {
        return this._exportaciones.asObservable();
    }
    /**
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getExportaciones(page: number = 0, size: number = 10, sort: string = 'ano', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: InventoryPagination; exportaciones: InventoryExportacion[] }>
    {
        return this._httpClient.get<{ pagination: InventoryPagination; exportaciones: InventoryExportacion[] }>('api/apps/ecommerce/inventory/exportaciones', {
            params: {
                page: '' + page,
                size: '' + size,
                sort,
                order,
                search,
            },
        }).pipe(
            tap((response) =>
            {
                console.log('response', response);
                this._pagination.next(response.pagination);
                this._exportaciones.next(response.exportaciones);
            }),
        );
    }


    getImportsById(id: string): Observable<InventoryExportacion>
    {
        return this._exportaciones.pipe(
            take(1),
            map((exportaciones) =>
            {
                const exportacion = exportaciones.find(item => item.id === id) || null;

                this._exportaciones.next(exportacion ? [exportacion] : []);

                return exportacion;
            }),
            switchMap((exportacion) =>
            {
                if ( !exportacion )
                {
                    return throwError('Could not found import with id of ' + id + '!');
                }

                return of(exportacion);
            }),
        );
    }

    createExportacion(): Observable<InventoryExportacion>
    {
        return this.exportaciones$.pipe(
            take(1),
            switchMap(exportaciones => this._httpClient.post<InventoryExportacion>('api/apps/ecommerce/inventory/exportaciones', {}).pipe(
                map((newExportacion) =>
                {
                    this._exportaciones.next([newExportacion, ...exportaciones]);

                    return newExportacion;
                }),
            )),
        );
    }

    /**
     *
     * @param id
     * @param exportacion
     */
    updateExportacion(id: string, exportacion: InventoryExportacion): Observable<InventoryExportacion>
    {
        return this.exportaciones$.pipe(
            take(1),
            switchMap(exportaciones => this._httpClient.patch<InventoryExportacion>('api/apps/ecommerce/inventory/exportaciones', {
                id,
                exportacion,
            }).pipe(
                map((updatedExportacion) =>
                {
                    const index = exportaciones.findIndex(item => item.id === id);

                    exportaciones[index] = updatedExportacion;

                    this._exportaciones.next(exportaciones);

                    return updatedExportacion;
                }),
                switchMap(updatedExportacion => this.exportacion$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() =>
                    {
                        this._exportacion.next(updatedExportacion);

                        return updatedExportacion;
                    }),
                )),
            )),
        );
    }

    /**
     *
     * @param id
     */
    deleteExportacion(id: string): Observable<boolean>
    {
        return this.exportaciones$.pipe(
            take(1),
            switchMap(exportaciones => this._httpClient.delete('api/apps/ecommerce/inventory/exportaciones', {params: {id}}).pipe(
                map((isDeleted: boolean) =>
                {
                    const index = exportaciones.findIndex(item => item.id === id);

                    exportaciones.splice(index, 1);

                    this._exportaciones.next(exportaciones);

                    return isDeleted;
                }),
            )),
        );
    }
}

