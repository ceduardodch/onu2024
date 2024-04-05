import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pais } from './pais.model';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private apiUrl = 'http://localhost:3000/paises';

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
}
