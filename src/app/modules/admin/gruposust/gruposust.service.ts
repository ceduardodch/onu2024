import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gruposust } from './gruposust.model';

@Injectable({
  providedIn: 'root'
})
export class GruposustService {
  private apiUrl = 'http://localhost:3000/gruposusts';

  constructor(private http: HttpClient) { }

  getGruposusts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  
  addGruposust(gruposust: Gruposust): Observable<Gruposust> {
    return this.http.post<Gruposust>(this.apiUrl, gruposust);
  }

  updateGruposust(id: number, gruposust: Gruposust): Observable<Gruposust> {
    if (!id || id <= 0) {
      throw new Error('ID de año no válido');
    }
    return this.http.put<Gruposust>(`${this.apiUrl}/${id}`, gruposust);
  }

  deleteGruposust(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de año no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
