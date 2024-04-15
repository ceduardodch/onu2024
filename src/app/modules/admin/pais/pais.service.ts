import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
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
  
  searchPaises(term: string): Observable<any[]> {
    if (term === '') {
      return of([]); // Si el término de búsqueda está vacío, retorna un Observable de un array vacío.
    }
    return this.http.get<any[]>(`${this.apiUrl}/search?name=${term}`).pipe(
      catchError(this.handleError<any[]>('searchPaises', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T); // Debes importar 'of' de 'rxjs' para que esto funcione.
    };
  }
}
