import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sustancia } from './sustancia.model';

@Injectable({
  providedIn: 'root'
})
export class SustanciaService {
  private apiUrl = 'http://localhost:3000/sustancias';

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
    return this.http.put<Sustancia>(`${this.apiUrl}/${id}`, { name: sustancia.name });
  }

  deleteSustancia(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de Sustancia no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchSustancia(name: string): Observable<Sustancia[]> {
    return this.http.get<Sustancia[]>(`${this.apiUrl}/search?name=${name}`);
  }
}
