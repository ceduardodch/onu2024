import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Grupo_sust } from './grupo-sust.model';

@Injectable({
  providedIn: 'root'
})
export class Grupo_sustService {
  private apiUrl = 'http://localhost:3000/grupo_susts';

  constructor(private http: HttpClient) { }

  getGrupo_susts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  
  addGrupo_sust(grupo_sust: Grupo_sust): Observable<Grupo_sust> {
    return this.http.post<Grupo_sust>(this.apiUrl, grupo_sust);
  }

  updateGrupo_sust(id: number, grupo_sust: Grupo_sust): Observable<Grupo_sust> {
    if (!id || id <= 0) {
      throw new Error('ID de año no válido');
    }
    return this.http.put<Grupo_sust>(`${this.apiUrl}/${id}`, grupo_sust);
  }

  deleteGrupo_sust(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de año no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
