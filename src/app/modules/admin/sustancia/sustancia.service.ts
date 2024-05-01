import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { Sustancia } from './sustancia.model';

@Injectable({
  providedIn: 'root'
})
export class SustanciaService {
  private apiUrl = environment.apiUrl+'/sustancias';

  constructor(private http: HttpClient) { }

  getSustancias(): Observable<Sustancia[]> {
    return this.http.get<Sustancia[]>(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  getSustanciaActivo(): Observable<Sustancia[]> {
    return this.http.get<Sustancia[]>(`${this.apiUrl}/active`).pipe(
      catchError(this.handleError)
    );
  }

  addSustancia(sustancia: Sustancia): Observable<Sustancia> {
    return this.http.post<Sustancia>(this.apiUrl, sustancia);
  }
  updateSustancia(id: number, sustancia: Sustancia): Observable<Sustancia> {
    if (!id || id <= 0) {
      throw new Error('ID de Sustancia no válido');
    }
    return this.http.put<Sustancia>(`${this.apiUrl}/${id}`, sustancia);
  }

  deleteSustancia(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de Sustancia no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchSustancia(searchValue: string): Observable<any[]> {
    
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
