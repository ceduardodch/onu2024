import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Importacion } from './importacion.model';
import { environment } from '../../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportacionService {

  private apiUrl = environment.apiUrl+'/importacion';

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

    deleteImportacion(id: number): Observable<any> {
        if (!id || id <= 0) {
          throw new Error('ID de país no válido');
        }
        return this.http.delete(`${this.apiUrl}/${id}`);
      }
}
