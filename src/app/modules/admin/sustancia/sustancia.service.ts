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

  // Obtener todas las sustancias
  getSustancias(): Observable<Sustancia[]> {
    return this.http.get<Sustancia[]>(this.apiUrl);
  }

  // Agregar una nueva sustancia
  addSustancia(sustancia: Sustancia): Observable<Sustancia> {
    return this.http.post<Sustancia>(this.apiUrl, sustancia);
  }

  // Actualizar una sustancia existente
  updateSustancia(id: number, sustancia: Partial<Sustancia>): Observable<Sustancia> {
    if (!id || id <= 0) {
      throw new Error('ID de Sustancia no válido');
    }
    return this.http.put<Sustancia>(`${this.apiUrl}/${id}`, sustancia);
  }

  // Eliminar una sustancia
  deleteSustancia(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de Sustancia no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
