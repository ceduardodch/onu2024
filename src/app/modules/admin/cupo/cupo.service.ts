import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { Cupo } from './cupo.model';

@Injectable({
  providedIn: 'root'
})
export class CupoService {
  private apiUrl = environment.apiUrl+'/cupos';

  constructor(private http: HttpClient) { }

  getCupos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getCuposByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?name=${name}`);
  }

  addCupo(cupo: Cupo): Observable<Cupo> {
    return this.http.post<Cupo>(this.apiUrl, cupo);
  }

  updateCupo(id: number, cupo: Cupo): Observable<Cupo> {
    if (!id || id <= 0) {
      throw new Error('ID de cupo no válido');
    }
    return this.http.put<Cupo>(`${this.apiUrl}/${id}`, cupo);
  }

  deleteCupo(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de cupo no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}