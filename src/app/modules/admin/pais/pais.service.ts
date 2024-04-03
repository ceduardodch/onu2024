import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pais } from './pais.model';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private apiUrl = 'http://localhost:3000/paises';

  constructor(private http: HttpClient) { }

  getPaises(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  
  addPais(pais: Pais): Observable<Pais> {
    return this.http.post<Pais>(this.apiUrl, pais);
  }

  updatePais(id: number, pais: Pais): Observable<Pais> {
    return this.http.put<Pais>(`${this.apiUrl}/${id}`, { name: pais.name });
  }

  deletePais(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchPaises(name: string): Observable<Pais[]> {
    return this.http.get<Pais[]>(`${this.apiUrl}/search?name=${name}`);
  }
}
