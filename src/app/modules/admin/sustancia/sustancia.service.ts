import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sustancia } from './sustancia.model';

@Injectable({
  providedIn: 'root'
})
export class SustanciaService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  getSustancias(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  addSustancia(sustancia: Sustancia): Observable<Sustancia> {
    return this.http.post<Sustancia>(this.apiUrl, sustancia);
  }
}
