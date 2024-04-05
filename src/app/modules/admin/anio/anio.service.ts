import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Anio } from './anio.model';

@Injectable({
  providedIn: 'root'
})
export class AnioService {
  private apiUrl = 'http://localhost:3000/anios';

  constructor(private http: HttpClient) { }

  getAnios(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  
  addAnio(anio: Anio): Observable<Anio> {
    return this.http.post<Anio>(this.apiUrl, anio);
  }

  updateAnio(id: number, anio: Anio): Observable<Anio> {
    if (!id || id <= 0) {
      throw new Error('ID de año no válido');
    }
    return this.http.put<Anio>(`${this.apiUrl}/${id}`, anio);
  }

  deleteAnio(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de año no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
