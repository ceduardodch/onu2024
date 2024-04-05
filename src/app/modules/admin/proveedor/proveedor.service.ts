import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proveedor } from './proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:3000/proveedors';

  constructor(private http: HttpClient) { }

  getProveedors(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  addProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }
  updateProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    if (!id || id <= 0) {
      throw new Error('ID de proveedor no válido');
    }
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, proveedor);
  }

  deleteProveedor(id: number): Observable<any> {
    if (!id || id <= 0) {
      throw new Error('ID de proveedor no válido');
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
