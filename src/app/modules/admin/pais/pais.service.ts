import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { Pais } from './pais.model';
@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private apiUrl = environment.apiUrl+'/paises';

  constructor(private http: HttpClient) { }

  getPaises(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addPais(pais: Pais): Observable<Pais> {
    return this.http.post<Pais>(this.apiUrl, pais);
  }

  updatePais(id: number, pais: Pais): Observable<Pais> {
    if (!id || id <= 0) {
      throw new Error('ID de país no válido');
    }
    return this.http.put<Pais>(`${this.apiUrl}/${id}`,pais);
  }

  deletePais(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de país no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  searchPaises(searchValue: string): Observable<any[]> {
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
