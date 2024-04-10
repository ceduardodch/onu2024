import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Importador } from './importador.model';
import { environment } from '../../../../enviroments/environment';

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
}
