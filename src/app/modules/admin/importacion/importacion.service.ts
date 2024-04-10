import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Importacion } from './importacion.model';

@Injectable({
  providedIn: 'root'
})
export class ImportacionService {
  private apiUrl = 'http://localhost:3000/importacion';

  constructor(private http: HttpClient) { }

  getImportacion(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  addImportacion(importacion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, importacion);
  }

  getImportacionByImportador(importador: string): Observable<any> {

    return this.http.get<Importacion>(`${this.apiUrl}/${importador}`);
    }
}
