import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { Importacion } from './importacion.model';

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
  getImportacionByImportador(importador: string, filtro: string): Observable<any> {
    let params = new HttpParams().set('filtro', filtro);

    return this.http.get<Importacion>(`${this.apiUrl}/cuposolicitud/${importador}`, { params: params });
    }
    getImportacionById(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de importación no válido');
    }
    return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    deleteImportacion(id: number): Observable<any> {
        if (!id || id <= 0) {
          throw new Error('ID de país no válido');
        }
        return this.http.delete(`${this.apiUrl}/${id}`);
      }

        aproveImportacion(id: number): Observable<any> {
            if (!id || id <= 0) {
            throw new Error('ID de país no válido');
            }
            return this.http.put(`${this.apiUrl}/status/${id}`, {});
        }

      uploadFile(file: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/upload`, file);
      }

      updateImportacion(importacion: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/`, importacion);
      }

      downloadFile(fileId: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/upload/${fileId}`);
      }

}
