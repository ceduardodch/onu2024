import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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

  getAniosActivo(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
        map(anios => anios.filter(anio => anio.activo))
    );
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
  toggleActivo(anio: any): void {
    anio.activo = !anio.activo;
    // Aquí deberías agregar el código para actualizar la base de datos
}
  deleteAnio(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de año no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
