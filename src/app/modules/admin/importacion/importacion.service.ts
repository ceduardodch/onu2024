import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Importacion } from './importacion.model';

@Injectable({
  providedIn: 'root'
})
export class ImportacionService {
  private apiUrl = 'http://localhost:3000/imports';

  constructor(private http: HttpClient) { }

  getImportacion(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  addImportacion(user: Importacion): Observable<Importacion> {
    return this.http.post<Importacion>(this.apiUrl, user);
  }
}
