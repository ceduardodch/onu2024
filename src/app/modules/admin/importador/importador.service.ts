import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { Importador } from './importador.model';

@Injectable({
  providedIn: 'root'
})
export class ImportadorService {
  private apiUrl = environment.apiUrl+'/importadors';

  constructor(private http: HttpClient) { }

  getImportadors(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  addImportador(importador: Importador): Observable<Importador> {
    return this.http.post<Importador>(this.apiUrl, importador);
  }
  updateImportador(id: number, importador: Importador): Observable<Importador> {
    if (!id || id <= 0) {
      throw new Error('ID de importador no válido');
    }
    return this.http.put<Importador>(`${this.apiUrl}/${id}`, importador);
  }

  deleteImportador(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de importador no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchImprotador(searchValue: string): Observable<any[]> {
    // Construye la URL de la solicitud aquí con `searchValue`
    const url = `${this.apiUrl}/search?name=${encodeURIComponent(searchValue)}`;
    
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Puedes mejorar el log de errores aquí
    console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    // TODO: Mejorar el manejo de errores dependiendo de tu aplicación
    return throwError('Something bad happened; please try again later.');
  }
}
