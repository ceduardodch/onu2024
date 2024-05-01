import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { Proveedor } from './proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = environment.apiUrl+'/proveedors/all';

  constructor(private http: HttpClient) { }

  getProveedors(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }

  getProveedorActivo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/active`).pipe(
      catchError(this.handleError)
    );
}
  addProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }
  updateProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    if (!id || id <= 0) {
      throw new Error('ID de proveedor no válido');
    }
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, proveedor);
  }

  deleteProveedor(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de proveedor no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchProveedor(searchValue: string): Observable<any[]> {
    
    const url = `${this.apiUrl}/search?name=${encodeURIComponent(searchValue)}`;
    
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    
    console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    
    return throwError('Something bad happened; please try again later.');
  }

}
