import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Importador } from './importador.model';

@Injectable({
  providedIn: 'root'
})
export class ImportadorService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  getImportadors(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  addImportador(importador: Importador): Observable<Importador> {
    return this.http.post<Importador>(this.apiUrl, importador);
  }
}
