import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Importador } from './importador.model';

@Injectable({
  providedIn: 'root'
})
export class ImportadorService {
  private apiUrl = 'http://localhost:3000/importadors';

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
    return this.http.put<Importador>(`${this.apiUrl}/${id}`, { name: importador.name });
  }

  deleteImportador(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de importador no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchImportadores(name: string): Observable<Importador[]> {
    return this.http.get<Importador[]>(`${this.apiUrl}/search?name=${name}`);
  }
}