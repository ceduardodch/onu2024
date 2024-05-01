import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { Anio } from './anio.model';

@Injectable({
  providedIn: 'root'
})
export class AnioService {
  private apiUrl = environment.apiUrl+'/anios';

  constructor(private http: HttpClient) { }

  getAnios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }

  getAniosActivo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/active`).pipe(
      catchError(this.handleError)
    );
}

  addAnio(anio: Anio): Observable<Anio> {
    return this.http.post<Anio>(this.apiUrl, anio);
  }

  updateAnio(id: number, anio: Anio): Observable<Anio> {
    if (!id || id <= 0) {
      throw new Error('ID de año no válido');
    }
    return this.http.put<Anio>(`${this.apiUrl}/${id}`, anio);
  }
  toggleActivo(anio: any): void {
    anio.activo = !anio.activo;
    // Aquí deberías agregar el código para actualizar la base de datos
}
  deleteAnio(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de año no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchAnio(searchValue: string): Observable<any[]> {
    
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
