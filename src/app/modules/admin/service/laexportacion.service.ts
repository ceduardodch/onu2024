import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { InventoryLaExportacion, InventoryPagination } from '../model/laexportacion.types';

@Injectable({providedIn: 'root'})
export class LaExportacionService
{
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> = new BehaviorSubject(null);
    private _laexportacion: BehaviorSubject<InventoryLaExportacion | null> = new BehaviorSubject(null);
    private _laexportaciones: BehaviorSubject<InventoryLaExportacion[] | null> = new BehaviorSubject(null);

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


    get laexportacion$(): Observable<InventoryLaExportacion>
    {
        return this._laexportacion.asObservable();
    }


    get laexportaciones$(): Observable<InventoryLaExportacion[]>
    {
        return this._laexportaciones.asObservable();
    }
    /**
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getLaExportaciones(page: number = 0, size: number = 10, sort: string = 'ano', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: InventoryPagination; laexportaciones: InventoryLaExportacion[] }>
    {
        return this._httpClient.get<{ pagination: InventoryPagination; laexportaciones: InventoryLaExportacion[] }>('api/apps/ecommerce/inventory/laexportaciones', {
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
                this._laexportaciones.next(response.laexportaciones);
            }),
        );
    }


    getImportsById(id: string): Observable<InventoryLaExportacion>
    {
        return this._laexportaciones.pipe(
            take(1),
            map((laexportaciones) =>
            {
                const laexportacion = laexportaciones.find(item => item.id === id) || null;

                this._laexportaciones.next(laexportacion ? [laexportacion] : []);

                return laexportacion;
            }),
            switchMap((laexportacion) =>
            {
                if ( !laexportacion )
                {
                    return throwError('Could not found import with id of ' + id + '!');
                }

                return of(laexportacion);
            }),
        );
    }

    createLaExportacion(): Observable<InventoryLaExportacion>
    {
        return this.laexportaciones$.pipe(
            take(1),
            switchMap(laexportaciones => this._httpClient.post<InventoryLaExportacion>('api/apps/ecommerce/inventory/laexportaciones', {}).pipe(
                map((newLaExportacion) =>
                {
                    this._laexportaciones.next([newLaExportacion, ...laexportaciones]);

                    return newLaExportacion;
                }),
            )),
        );
    }

    /**
     *
     * @param id
     * @param laexportacion
     */
    updateLaExportacion(id: string, laexportacion: InventoryLaExportacion): Observable<InventoryLaExportacion>
    {
        return this.laexportaciones$.pipe(
            take(1),
            switchMap(laexportaciones => this._httpClient.patch<InventoryLaExportacion>('api/apps/ecommerce/inventory/laexportaciones', {
                id,
                laexportacion,
            }).pipe(
                map((updatedLaExportacion) =>
                {
                    const index = laexportaciones.findIndex(item => item.id === id);

                    laexportaciones[index] = updatedLaExportacion;

                    this._laexportaciones.next(laexportaciones);

                    return updatedLaExportacion;
                }),
                switchMap(updatedLaExportacion => this.laexportacion$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() =>
                    {
                        this._laexportacion.next(updatedLaExportacion);

                        return updatedLaExportacion;
                    }),
                )),
            )),
        );
    }

    /**
     *
     * @param id
     */
    deleteLaExportacion(id: string): Observable<boolean>
    {
        return this.laexportaciones$.pipe(
            take(1),
            switchMap(laexportaciones => this._httpClient.delete('api/apps/ecommerce/inventory/laexportaciones', {params: {id}}).pipe(
                map((isDeleted: boolean) =>
                {
                    const index = laexportaciones.findIndex(item => item.id === id);

                    laexportaciones.splice(index, 1);

                    this._laexportaciones.next(laexportaciones);

                    return isDeleted;
                }),
            )),
        );
    }
}

