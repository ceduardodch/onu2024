import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { Gruposust } from './gruposust.model';

@Injectable({
  providedIn: 'root'
})
export class GruposustService {
  private apiUrl = environment.apiUrl+'/gruposusts/all';

  constructor(private http: HttpClient) { }

  getGruposusts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }

  getGruposustsActivo(): Observable<Gruposust[]> {
    return this.http.get<any>(`${this.apiUrl}/active`).pipe(
      catchError(this.handleError)
    );
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

  toggleActivo(anio: any): void {
    anio.activo = !anio.activo;
    // Aquí deberías agregar el código para actualizar la base de datos
  }

  searchGruposust(searchValue: string): Observable<any[]> {
    // Construye la URL de la solicitud aquí con `searchValue`
    const url = `${this.apiUrl}/search?name=${encodeURIComponent(searchValue)}`;
    
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Puedes mejorar el log de errores aquí
    console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    // TODO: Mejorar el manejo de errores dependiendo de tu aplicación
    return throwError('Something bad happened; please try again later.');
  }
}
