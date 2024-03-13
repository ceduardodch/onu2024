import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryPagination, InventoryImportacion } from '../model/importacion.types';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ImportacionService
{
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> = new BehaviorSubject(null);
    private _importacion: BehaviorSubject<InventoryImportacion | null> = new BehaviorSubject(null);
    private _importaciones: BehaviorSubject<InventoryImportacion[] | null> = new BehaviorSubject(null);

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


    get importacion$(): Observable<InventoryImportacion>
    {
        return this._importacion.asObservable();
    }


    get importaciones$(): Observable<InventoryImportacion[]>
    {
        return this._importaciones.asObservable();
    }
    /**
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getImportaciones(page: number = 0, size: number = 10, sort: string = 'ano', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: InventoryPagination; importaciones: InventoryImportacion[] }>
    {
        return this._httpClient.get<{ pagination: InventoryPagination; importaciones: InventoryImportacion[] }>('api/apps/ecommerce/inventory/importaciones', {
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
                this._importaciones.next(response.importaciones);
            }),
        );
    }


    getImportsById(id: string): Observable<InventoryImportacion>
    {
        return this._importaciones.pipe(
            take(1),
            map((importaciones) =>
            {
                const importacion = importaciones.find(item => item.id === id) || null;

                this._importaciones.next(importacion ? [importacion] : []);

                return importacion;
            }),
            switchMap((importacion) =>
            {
                if ( !importacion )
                {
                    return throwError('Could not found import with id of ' + id + '!');
                }

                return of(importacion);
            }),
        );
    }

    createImportacion(): Observable<InventoryImportacion>
    {
        return this.importaciones$.pipe(
            take(1),
            switchMap(importaciones => this._httpClient.post<InventoryImportacion>('api/apps/ecommerce/inventory/importaciones', {}).pipe(
                map((newImportacion) =>
                {
                    this._importaciones.next([newImportacion, ...importaciones]);

                    return newImportacion;
                }),
            )),
        );
    }

    /**
     *
     * @param id
     * @param importacion
     */
    updateImportacion(id: string, importacion: InventoryImportacion): Observable<InventoryImportacion>
    {
        return this.importaciones$.pipe(
            take(1),
            switchMap(importaciones => this._httpClient.patch<InventoryImportacion>('api/apps/ecommerce/inventory/importaciones', {
                id,
                importacion,
            }).pipe(
                map((updatedImportacion) =>
                {
                    const index = importaciones.findIndex(item => item.id === id);

                    importaciones[index] = updatedImportacion;

                    this._importaciones.next(importaciones);

                    return updatedImportacion;
                }),
                switchMap(updatedImportacion => this.importacion$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() =>
                    {
                        this._importacion.next(updatedImportacion);

                        return updatedImportacion;
                    }),
                )),
            )),
        );
    }

    /**
     *
     * @param id
     */
    deleteImportacion(id: string): Observable<boolean>
    {
        return this.importaciones$.pipe(
            take(1),
            switchMap(importaciones => this._httpClient.delete('api/apps/ecommerce/inventory/importaciones', {params: {id}}).pipe(
                map((isDeleted: boolean) =>
                {
                    const index = importaciones.findIndex(item => item.id === id);

                    importaciones.splice(index, 1);

                    this._importaciones.next(importaciones);

                    return isDeleted;
                }),
            )),
        );
    }
}

