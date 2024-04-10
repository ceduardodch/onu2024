import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sustancia } from './sustancia.model';
import { environment } from '../../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class SustanciaService {
  private apiUrl = environment.apiUrl+'/sustancias';

  constructor(private http: HttpClient) { }

  getSustancias(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  addSustancia(sustancia: Sustancia): Observable<Sustancia> {
    return this.http.post<Sustancia>(this.apiUrl, sustancia);
  }
  updateSustancia(id: number, sustancia: Sustancia): Observable<Sustancia> {
    if (!id || id <= 0) {
      throw new Error('ID de Sustancia no válido');
    }
    return this.http.put<Sustancia>(`${this.apiUrl}/${id}`, sustancia);
  }

  deleteSustancia(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de Sustancia no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
